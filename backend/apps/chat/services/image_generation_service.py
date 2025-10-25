"""Service for AI image generation"""

# Python Imports
import logging
import mimetypes

# Third Party Imports
import requests
from requests.exceptions import HTTPError

# Django Imports
from django.conf import settings
from django.core.files.base import ContentFile

# Project Imports
from videos.models import Image, Video
from videos.services.s3_service import S3Service

logger = logging.Logger(__name__)


class ImageGenerationService:
    """Handle image generation using HuggingFace(Replicate)"""  # Other Image Generation models could be supported in future

    @staticmethod
    def generate_with_hugginface(prompt: str, video: Video) -> str:
        """Generate video thumbnail using HugginFace

        Args:
        prompt: Image Generation Prompt
        """
        try:
            response = requests.post(
                "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0",
                json={"inputs": prompt},
                headers={
                    "Content-Type": "application/json",
                    "Authorization": f"Bearer {settings.HUGGINGFACE_API_KEY}",
                },
            )
            response.raise_for_status()

            image_bytes = response.content
            content_type = response.headers.get("Content-Type")
            ext = mimetypes.guess_extension(content_type)
            filename = f"generated_image{ext or '.jpg'}"

            image_content = ContentFile(image_bytes, name=filename)
            image_obj = Image(video=video)
            image_obj.image.save(
                filename,
                image_content,
                save=True,
            )

            s3_service = S3Service()
            url = s3_service.generate_presigned_url(
                image_obj.image.name,
            )

            if not url:
                logger.error(
                    "Error presigning url to S3 object for generated image",
                    extra={
                        "user_id": video.user.id,
                        "video_id": video.id,
                        "image_id": image_obj.id,
                    },
                )
                raise Exception(
                    f"Error while trying to presign url to S3 object for generated image:{image_obj.id}"
                )

            return url

        except HTTPError as e:
            logger.error(
                "Error Generating video image",
                extra={"user_id": video.user.id, "video_id": video.id},
            )
            raise Exception(f"Error Generating video image: {response.text()}")
