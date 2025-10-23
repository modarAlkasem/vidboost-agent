# Python Imports
from typing import Dict, Tuple
import logging

# Django Imports
from django.http import HttpRequest

# DRF Imports
from rest_framework import status

# Third Party Imports
from asgiref.sync import sync_to_async

# Project Import
from core.response import JsonResponse

# App Imports
from ..serializers import ChatMessageModelSerializer
from ..models import ChatMessage

logger = logging.Logger(__name__)


class ChatMessageService:
    """Service for handling Chat Message operations"""

    @staticmethod
    async def get(request: HttpRequest, *args: Tuple, **kwargs: Dict) -> JsonResponse:
        user = request.user
        session_id = kwargs.get("session_id")
        sessions = await sync_to_async(list)(
            ChatMessage.objects.filter(user=user, session=session_id)
        )
        logger.info(
            f"Conversation history has been returned",
            extra={"user_id": user.id, "chat_session_id": session_id},
        )
        return JsonResponse(
            data=ChatMessageModelSerializer(instance=sessions, many=True).data,
            status=status.HTTP_200_OK,
            safe=False,
        )
