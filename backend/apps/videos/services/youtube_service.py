# Python Imports
from typing import Dict, Optional, List
import logging

# Third Party Imports
import yt_dlp
from youtube_transcript_api import YouTubeTranscriptApi


logger = logging.getLogger(__name__)


class YouTubeService:
    """
    Service for fetching YouTube video data
    """

    @staticmethod
    def fetch_video_info(video_id: str) -> Dict:
        """
        Fetch YouTube video metadata using yt-dlp

        Returns:
        {
            'title':str,
            'description': str,
            'thumbnail':str,
            thumbnail_high_res:str,
            'duration': int (seconds),
            'view_count': int,
            'like_count': int,
            'comment_count': int,
            'published_at': str (ISO format),
            'channel': {
                'id': str,
                'name': str,
                'subscriber_count': int,
                'thumbnail': str
            }
        }
        """
        try:
            ydl_opts = {"quiet": True, "no_warnings": True, "extract_flat": False}

            with yt_dlp.YoutubeDL(ydl_opts) as ydl:
                info = ydl.extract_info(
                    f"https://www.youtube.com/watch?v={video_id}", download=False
                )

                return {
                    "title": info.get("title"),
                    "description": info.get("description", ""),
                    "thumbnail": info.get("thumbnail"),
                    "thumbnail_high_res": info.get("thumbnails", [{}])[-1].get(
                        "url", ""
                    ),
                    "duration": info.get("duration"),
                    "view_count": info.get("view_count", "Not Available"),
                    "like_count": info.get("like_count", "Not Available"),
                    "comment_count": info.get("comment_count", "Not Available"),
                    "published_at": info.get("upload_date", "Not Available"),
                    "channel": {
                        "id": info.get("channel_id", ""),
                        "name": info.get("channel", ""),
                        "thumbnail": info.get("channel_thumbnail_url", ""),
                        "subscriber_count": info.get("channel_follower_count", 0),
                    },
                }
        except Exception as e:
            logger.error(f"Error fetching video info for {video_id}: {str(e)}")
            raise Exception(f"Failed tp fetch video Info for {video_id}")

    @staticmethod
    def fetch_transcript(video_id: str, languages: List[str] = None) -> Optional[dict]:
        """
        Fetch video transcript

        Args:
        video_id: YouTube Video ID
        languages: List of language codes (default: ['en'])

        Returns:
        {
            'transcript':[
            {'text':str, 'timestamp':str}, # timestamp in HH:MM:SS format
            ],
            'langauge':str,
            'is_auto_generated':bool,
        }
        """
        if languages is None:
            languages = ["en"]

        try:

            youtube_transcript_api = YouTubeTranscriptApi()
            transcript_list = youtube_transcript_api.list(video_id)

            try:

                transcript = transcript_list.find_manually_created_transcript(languages)
                is_auto_generated = False
            except:

                transcript = transcript_list.find_generated_transcript(languages)
                is_auto_generated = True

            raw_transcript = transcript.fetch()

            transformed_transcript = []
            for item in raw_transcript:
                timestamp = YouTubeService._seconds_to_timestamp(item.start)
                transformed_transcript.append(
                    {"text": item.text, "timestamp": timestamp}
                )

            return {
                "transcript": transformed_transcript,
                "language": transcript.language_code,
                "is_auto_generated": is_auto_generated,
            }

        except Exception as e:
            logger.error(f"Error fetching transcript for {video_id}: {str(e)}")
            raise Exception(f"Failed to fetch transcript: {str(e)}")

    @staticmethod
    def _seconds_to_timestamp(seconds: float) -> str:

        hours = int(seconds // 3600)
        minutes = int((seconds % 3600) // 60)
        secs = int(seconds % 60)

        if hours == 0:
            if minutes == 0:
                return f"00:{secs:02d}"
            return f"{minutes:02d}:{secs:02d}"
        return f"{hours}:{minutes:02d}:{secs:02d}"
