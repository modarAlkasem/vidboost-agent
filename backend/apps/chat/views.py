# Python Imports
from typing import Tuple, Dict

# Django Imports
from django.views import View
from django.http import HttpRequest, JsonResponse

# Project Imports
from core.mixins import JWTAuthMixin

# App Imports
from .services.chat_session_service import ChatSessionService
from .services.chat_message_service import ChatMessageService


class ChatSessionView(JWTAuthMixin, View):

    async def post(
        self, request: HttpRequest, *args: Tuple, **kwargs: Dict
    ) -> JsonResponse:
        return await ChatSessionService.create(request, *args, **kwargs)


class ChatMessageView(JWTAuthMixin):
    async def get(request: HttpRequest, *args: Tuple, **kwargs: Dict) -> JsonResponse:
        return await ChatMessageService.get(request, *args, **kwargs)
