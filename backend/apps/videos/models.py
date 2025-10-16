# Python Imports
import uuid

# Django Imports
from django.db import models
from django.core.serializers.json import DjangoJSONEncoder

# Project Imports
from core.models import TimeStampMixin
from authentication.models import User

# App Imports
from .utils import get_generated_video_image_path


class Video(TimeStampMixin):
    id = models.UUIDField("id", primary_key=True, default=uuid.uuid4)
    provider_video_id = models.CharField("provider video ID", max_length=36)
    user = models.ForeignKey(
        User,
        verbose_name="user",
        on_delete=models.CASCADE,
        related_name="videos",
        related_query_name="video",
    )

    class Meta:
        verbose_name = "video"
        verbose_name_plural = "videos"
        constraints = [
            models.UniqueConstraint(
                fields=("provider_video_id", "user"),
                name="unique_user_provider_video_id",
            ),
        ]


class Title(TimeStampMixin):
    title = models.CharField("title", max_length=255)
    video = models.ForeignKey(
        Video,
        verbose_name="video",
        on_delete=models.CASCADE,
        related_name="titles",
        related_query_name="title",
    )


class Meta:
    verbose_name = "title"
    verbose_name_plural = "titles"


class Transcript(TimeStampMixin):
    transcript = models.JSONField(encoder=DjangoJSONEncoder)

    video = models.OneToOneField(
        Video,
        verbose_name="video",
        on_delete=models.CASCADE,
        related_name="related_transcript",
        related_query_name="transcript",
    )


class Meta:
    verbose_name = "transcript"
    verbose_name_plural = "transcripts"


class Image(TimeStampMixin):
    image = models.ImageField(upload_to=get_generated_video_image_path)
    video = models.ForeignKey(
        Video,
        verbose_name="video",
        on_delete=models.CASCADE,
        related_name="images",
        related_query_name="image",
    )


class Meta:
    verbose_name = "image"
    verbose_name_plural = "images"
