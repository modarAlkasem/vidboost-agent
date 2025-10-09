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
    self,
    video_id: int,
    fetch_transcript: bool = True,
):
    """
    Async task for fetching specific Youtube video's info

    Args:
        video_id: Video model ID (not YouTube ID)
        fetch_transcript: Whether to fetch transcript (default: True)
        room_name: Optional WebSocket room name for real-time updates
    """
    task_id = self.request.id
    _send_websocket_task_update(task_id, "Starting video data fetch...", "STARTED")

    try:

        video = Video.objects.get(id=video_id)
        provider_video_id = video.provider_video_id

        _send_websocket_task_update(
            task_id, "Fetching video information...", "PROCESSING"
        )
        video_info = YouTubeService.fetch_video_info(provider_video_id)
        video_transcript = None

        if fetch_transcript:
            _send_websocket_task_update(
                task_id, "Fetching video transcript...", "PROCESSING"
            )
            try:
                fetch_transcript = Transcript.objects.get(video=video).transcript

            except Transcript.DoesNotExist:

                video_transcript = YouTubeService.fetch_transcript(
                    provider_video_id, ["en"]
                )["transcript"]
                Transcript.objects.create(video=video, transcript=video_transcript)

        result = {"video_info": video_info, "video_transcript": video_transcript}

        _send_websocket_task_update(
            task_id, "Video data fetched successfully", "COMPLETED", result
        )

        logger.info(f"Successfully fetched data for video {provider_video_id}")

        return result

    except Video.DoesNotExist as e:
        _send_websocket_task_update(
            task_id, f"Video with id {video_id} does not exist", "FAILURE"
        )
        logger.error(f"Video with id {video_id} does not exist")
        raise e

    except Exception as e:
        logger.error(f"Error in fetch_video_info_task: {str(e)}")

        _send_websocket_task_update(task_id, "Retry fetching video info", "RETRY")

        raise self.retry(exc=0, countdown=60)


def _send_websocket_task_update(
    task_id: str, message: str, status: str, data: dict = None
):
    """
    Send task updates to Websocket connected to this task

    Args:
        task_id: Celery task ID
        message: Status message
        status: Status string (processing, success, error)
        data: Optional result data
    """
    channel_layer = get_channel_layer()

    async_to_sync(channel_layer.group_send)(
        f"task_{task_id}",
        {"type": "task_update", "message": message, "status": status, "data": data},
    )
