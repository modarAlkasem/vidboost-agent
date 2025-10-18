# Python Imports
import uuid

# Django Imports
from django.db import models
from django.core.serializers.json import DjangoJSONEncoder

# Project Imports
from core.models import CreatedAtMixin
from videos.models import Video
from authentication.models import User


# App Imports
from .constants import ChatMessageRoleChoices


class ChatSession(CreatedAtMixin):
    id = models.UUIDField("ID", primary_key=True, default=uuid.uuid4)
    user = models.ForeignKey(
        User,
        verbose_name="user",
        on_delete=models.CASCADE,
        related_name="chat_sessions",
        related_query_name="chat_session",
    )
    video = models.ForeignKey(
        Video,
        verbose_name="video",
        on_delete=models.CASCADE,
        related_name="chat_sessions",
        related_query_name="chat_session",
    )

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=["user", "video"], name="unique_user_video")
        ]


class ChatMessage(CreatedAtMixin):

    id = models.UUIDField("ID", primary_key=True, default=uuid.uuid4)
    session = models.ForeignKey(
        ChatSession,
        verbose_name="session",
        on_delete=models.CASCADE,
        related_name="chat_messages",
        related_query_name="chat_message",
    )
    role = models.CharField(
        "role", max_length=10, choices=ChatMessageRoleChoices.choices
    )
    content = models.TextField()
    tools_calls = models.JSONField(encoder=DjangoJSONEncoder, default=list, null=True)

    class Meta:
        ordering = ("created_at",)
        indexes = [models.Index(fields=["session", "created_at"])]
