"""
Business logic for Video's Title operations
"""

# Python Imports
import logging

# REST Framework Imports
from rest_framework.request import Request
from rest_framework import status


# Third-Party Imports
from asgiref.sync import sync_to_async

# Project Imports

from core.response import Response

# App Imports
from ..serializer import TitleSerializer
from videos.models import Video

logger = logging.getLogger(__name__)


class TitleService:

    @staticmethod
    async def list(request: Request, video_id: str) -> Response:
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
            logger.info(
                "Video's titles Fetched successfully!",
                extra={
                    "user_id": request.user.id,
                    "video_id": video_id,
                },
            )

            return Response(data=serializer.data, status_code=status.HTTP_200_OK)

        except Video.DoesNotExist:

            logger.error(
                "Error fetching Video's titles",
                extra={
                    "user_id": request.user.id,
                    "video_id": video_id,
                },
            )
            return Response(
                data={"video_id": "Invalid 'video_id' param"},
                status_code=status.HTTP_400_BAD_REQUEST,
            )
