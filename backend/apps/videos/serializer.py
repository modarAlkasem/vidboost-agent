# Python Imports
import re
from typing import Optional

# REST Framework Imports
from rest_framework import serializers


class CreateVideoSerializer(serializers.Serializer):
    """
    Serializer for creating a video from YouTube URL.
    Handels URL validation and video ID extraction
    """

    url = serializers.URLField()

    YOUTUBE_PATTERNS = [
        r"(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})",
        r"(?:https?:\/\/)?(?:www\.)?youtu\.be\/([a-zA-Z0-9_-]{11})",
        r"(?:https?:\/\/)?(?:www\.)?youtube\.com\/embed\/([a-zA-Z0-9_-]{11})",
        r"(?:https?:\/\/)?(?:www\.)?youtube\.com\/v\/([a-zA-Z0-9_-]{11})",
        r"(?:https?:\/\/)?(?:www\.)?youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})",
    ]

    def _extract_video_id(self, url: str) -> Optional[str]:

        for pattern in self.YOUTUBE_PATTERNS:
            match = re.search(pattern, url)

            if match:
                return match.group(1)

            return None

    def validate_url(self, value: str) -> str:

        video_id = self._extract_video_id(value)

        if not video_id:
            raise serializers.ValidationError(
                "Invalid YouTube URL. Please provide a valid YouTube video link."
            )
