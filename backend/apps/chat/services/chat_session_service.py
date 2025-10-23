# Python Imports
import json
from typing import Dict, Tuple
import logging

# Django Imports
from django.http import HttpRequest

# DRF Imports
from rest_framework.exceptions import ValidationError
from rest_framework import status

# Project Import
from core.response import JsonResponse

# App Imports
from ..serializers import ChatSessionModelSerializer
from ..models import ChatSession

logger = logging.Logger(__name__)


class ChatSessionService:
    """Service for handling Chat Session operations"""

    @staticmethod
    async def create(
        request: HttpRequest, *args: Tuple, **kwargs: Dict
    ) -> JsonResponse:
        data = json.loads(request.body)
        user = request.user

        data["user"] = user
        is_new = False
        chat_session = None
        try:
            serializer = ChatSessionModelSerializer(data=data)
            serializer.is_valid(raise_exception=True)

            try:
                video = serializer.validated_data.get("video")
                chat_session = await ChatSession.objects.aget(user=user, video=video)
                logger.info(
                    f"Chat Session has been found!",
                    extra={"user_id": user.id, "chat_session_id": chat_session.id},
                )

            except ChatSession.DoesNotExist:
                is_new = True
                chat_session = await ChatSession.objects.acreate(user=user, video=video)
                logger.info(
                    f"New Chat Session has been created!",
                    extra={"user_id": user.id, "chat_session_id": chat_session.id},
                )

            finally:

                return JsonResponse(
                    data=ChatSessionModelSerializer(instance=chat_session).data
                    | {"is_new": is_new},
                    status=status.HTTP_201_CREATED if is_new else status.HTTP_200_OK,
                    safe=False,
                )

        except ValidationError as e:
            return JsonResponse(
                data=e.detail, status=status.HTTP_400_BAD_REQUEST, safe=False
            )
