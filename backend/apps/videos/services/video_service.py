"""
Business logic for video operations
"""

# Python Imports
from typing import List, Union
import logging

# REST Framework Imports
from rest_framework.request import Request
from rest_framework import status
from rest_framework.exceptions import ValidationError


# Project Imports
from authentication.models import User
from core.response import Response

# App Imports
from ..serializer import CreateVideoSerializer, VideoSerializer
from videos.models import Video


logger = logging.getLogger(__name__)


class VideoService:

    @staticmethod
    def create(request: Request) -> Response:
        """
        POST /api/videos/
        {
            "url":"https://www.youtube.com/watch?v=dQw4w9WgXcQ"
        }
        """
        logger.info(
            "Video creation requested",
            extra={
                "user_id": request.user.id,
                "request_data": request.data,
            },
        )
        serializer = CreateVideoSerializer(data=request.data)
        try:
            serializer.is_valid(raise_exception=True)

            video_id = serializer.validated_data["video_id"]

            video, is_new = VideoService.get_or_create_video(video_id, request.user)
            logger.info(
                "Video created Successfully",
                extra={
                    "user_id": request.user.id,
                    "video_id": video.id,
                    "is_new": is_new,
                    "video_id": video.id,
                },
            )
            response = {
                "data": VideoSerializer(instance=video).data | {"is_new": is_new},
                "status_code": (
                    status.HTTP_201_CREATED if is_new else status.HTTP_200_OK
                ),
                "status_text": "CREATED" if is_new else "SUCCESS",
            }
            return Response(**response)
        except ValidationError as e:
            logger.error(
                "Error creating video",
                extra={
                    "user_id": request.user.id,
                    "request_data": request.data,
                    "error": str(e),
                },
            )
            return Response(
                data=e.detail,
                status_code=status.HTTP_400_BAD_REQUEST,
                status_text="BAD_REQUEST",
            )

    @staticmethod
    def get_or_create_video(video_id: str, user: User) -> List[Union[Video, bool]]:
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

            result = [
                video,
                True,
            ]
        else:
            result = [video, False]

        return result
