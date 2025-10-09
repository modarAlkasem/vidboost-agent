"""
Business logic for video operations
"""

# Python Imports
from typing import Dict, Optional, Tuple
import logging

# REST Framework Imports
from rest_framework.request import Request
from rest_framework import status


# Project Imports
from authentication.models import User
from core.response import Response

# App Imports
from ..tasks import fetch_video_info_task
from ..serializer import CreateVideoSerializer, VideoSerializer
from videos.models import Video


class VideoService:

    @staticmethod
    def create(request: Request) -> Response:
        """
        POST /api/videos/
        {
            "url":"https://www.youtube.com/watch?v=dQw4w9WgXcQ"
        }
        """

        serializer = CreateVideoSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        video_id = serializer.validated_data["video_id"]

        video, is_new, message = VideoService.get_or_create_video(
            video_id, request.user
        )

        response = {
            "data": VideoSerializer(instance=video).data,
            "status_code": status.HTTP_201_CREATED if is_new else status.HTTP_200_OK,
            "status_text": "CREATED" if is_new else "SUCCESS",
        }
        return Response(**response)

    @staticmethod
    def get_or_create_video(video_id: str, user: User) -> Tuple[Video, bool, str]:
        """
        Get or create video

        Args:
            url: YouTube video URL
            user: User instance

        Returns:
            (video, is_new, message)
        """

        video = Video.objects.filter(provider_video_id=video_id, user=user).first()

        if not video:
            video = Video.objects.create(provider_video_id=video_id, user=user)

            result = (
                video,
                True,
                "Video created successfully. Data is being fetched.",
            )
        else:
            result = (video, False, "Video already exists. Data is being fetched.")

        fetch_video_info_task.delay(video.id)

        return result
