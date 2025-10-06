"""
Celery task for async video processing
"""

# Python Imports
import logging

# Third Party Imports
from celery import shared_task
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

# App Imports
from .models import Video, Transcript
from .services.youtube_service import YouTubeService


logger = logging.getLogger(__name__)


@shared_task(bind=True, max_retries=3)
def fetch_video_info_task(
    self, video_id: int, fetch_transcript: bool = True, room_name: str = None
):
    """
    Async task for fetching specific Youtube video's info

    Args:
        video_id: Video model ID (not YouTube ID)
        fetch_transcript: Whether to fetch transcript (default: True)
        room_name: Optional WebSocket room name for real-time updates
    """
    try:
        video = Video.objects.get(id=video_id)
        provider_video_id = video.provider_video_id

        if room_name:

            _send_websocket_update(
                room_name, "Fetching video information...", "processing"
            )

        video_info = YouTubeService.fetch_video_info(provider_video_id)
        video_transcript = None

        if fetch_transcript:
            try:
                fetch_transcript = Transcript.objects.get(video=video).transcript

            except Transcript.DoesNotExist:

                video_transcript = YouTubeService.fetch_transcript(
                    provider_video_id, ["en"]
                )["transcript"]

        result = {"video_info": video_info, "video_transcript": video_transcript}

        if room_name:
            _send_websocket_update(
                room_name, "Video data fetched successfully", "complete", result
            )

        logger.info(f"Successfully fetched data for video {provider_video_id}")

        return result

    except Video.DoesNotExist as e:
        logger.error(f"Video with id {video_id} does not exist")
        raise e

    except Exception as e:
        logger.error(f"Error in fetch_video_info_task: {str(e)}")

        if room_name:
            _send_websocket_update(room_name, f"Error: {str(e)}", "error")

        raise self.retry(exc=0, countdown=60)


def _send_websocket_update(
    room_name: str, message: str, status: str, data: dict = None
):
    """
    Helper function to send WebSocket updates
    """
    channel_layer = get_channel_layer()

    async_to_sync(channel_layer.group_send)(
        f"video_{room_name}",
        {"type": "video_update", "message": message, "status": status, "data": data},
    )
