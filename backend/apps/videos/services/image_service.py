"""
Business logic for Video's Thumbnail operations
"""

# Python Imports
import logging

# Django Imports
from django.http import JsonResponse, HttpRequest

# REST Framework Imports
from rest_framework import status


# Third-Party Imports
from asgiref.sync import sync_to_async

# App Imports
from ..serializer import TitleSerializer
from videos.models import Video
from .s3_service import S3Service

logger = logging.getLogger(__name__)


class ImageService:

    @staticmethod
    async def list(request: HttpRequest, video_id: str) -> JsonResponse:
        """
        GET /api/videos/video_id/images/
        """

        logger.info(
            "Video thumbnails requested",
            extra={"user_id": request.user.id, "video_id": video_id},
        )

        try:

            video = await Video.objects.aget(id=video_id, user=request.user)

            images = await sync_to_async(list)(video.images.all())

            s3_service = S3Service()
            images_data = []

            for image in images:
                s3_key = image.image.name

                if s3_key:
                    presigned_url = await sync_to_async(
                        s3_service.generate_presigned_url
                    )(s3_key)

                else:
                    presigned_url = None

                images_data.append(
                    {
                        "id": image.id,
                        "url": presigned_url,
                        "video": video.id,
                        "created_at": image.created_at,
                        "updated_at": image.updated_at,
                    }
                )

            logger.info(
                f"Fetched {len(images_data)} thumbnails for video",
                extra={"user_id": request.user.id, "video_id": video_id},
            )

            return JsonResponse(data=images_data, status=status.HTTP_200_OK)
        except Video.DoesNotExist as e:
            logger.error(
                "Video not found",
                extra={"user_id": request.user.id, "video_id": video_id},
            )
            return JsonResponse(
                data={
                    "details": "Video not found",
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        except Exception as e:
            logger.error(
                "Error fetching video's thumbnails",
                extra={"user_id": request.user.id, "video_id": video_id},
            )

            return JsonResponse(
                {"error": "Internal server error"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
