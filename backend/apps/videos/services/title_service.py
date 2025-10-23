"""
Business logic for Video's Title operations
"""

# Python Imports
import logging

# Django Imports
from django.http import HttpRequest

# REST Framework Imports
from rest_framework import status


# Third-Party Imports
from asgiref.sync import sync_to_async

# Project Imports
from core.response import JsonResponse

# App Imports
from ..serializer import TitleSerializer
from videos.models import Video

logger = logging.getLogger(__name__)


class TitleService:

    @staticmethod
    async def list(request: HttpRequest, video_id: str) -> JsonResponse:
        """
        GET /api/videos/video_id/titles/

        """

        logger.info(
            "Video titles requested",
            extra={
                "user_id": request.user.id,
                "video_id": video_id,
            },
        )

        try:
            video = await Video.objects.aget(id=video_id)

            titles = await sync_to_async(list)(video.titles.all())

            serializer = TitleSerializer(instance=titles, many=True)
            serialized_data = await sync_to_async(lambda: serializer.data)()
            logger.info(
                "Video's titles Fetched successfully!",
                extra={
                    "user_id": request.user.id,
                    "video_id": video_id,
                },
            )

            return JsonResponse(
                data=serialized_data, status=status.HTTP_200_OK, safe=False
            )

        except Video.DoesNotExist:

            logger.error(
                "Error fetching Video's titles",
                extra={
                    "user_id": request.user.id,
                    "video_id": video_id,
                },
            )
            return JsonResponse(
                data={"video_id": "Invalid 'video_id' param"},
                status=status.HTTP_400_BAD_REQUEST,
            )
