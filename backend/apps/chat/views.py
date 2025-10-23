# Python Imports
from typing import Tuple, Dict

# Django Imports
from django.views import View
from django.http import HttpRequest
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt

# Project Imports
from core.mixins import JWTAuthMixin
from core.response import JsonResponse

# App Imports
from .services.chat_session_service import ChatSessionService
from .services.chat_message_service import ChatMessageService


@method_decorator([csrf_exempt], name="dispatch")
class ChatSessionView(JWTAuthMixin, View):

    async def post(
        self, request: HttpRequest, *args: Tuple, **kwargs: Dict
    ) -> JsonResponse:
        return await ChatSessionService.create(request, *args, **kwargs)


@method_decorator([csrf_exempt], name="dispatch")
class ChatMessageView(JWTAuthMixin, View):
    async def get(request: HttpRequest, *args: Tuple, **kwargs: Dict) -> JsonResponse:
        return await ChatMessageService.get(request, *args, **kwargs)
