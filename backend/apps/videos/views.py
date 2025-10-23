# Django Imports
from django.views import View
from django.http import HttpRequest

# REST Framework Imports
from rest_framework.request import Request
from rest_framework.viewsets import ViewSet

# Project Imports
from core.response import Response, JsonResponse

# App Imports
from .services.video_service import VideoService
from .services.title_service import TitleService
from .services.image_service import ImageService
from core.mixins import JWTAuthMixin


class VideoViewSet(ViewSet):
    """
    ViewSet for video CRUD operations
    """

    def create(self, request: Request) -> Response:
        return VideoService.create(request)


class VideoTitlesView(JWTAuthMixin, View):
    async def get(self, request: HttpRequest, video_id) -> JsonResponse:
        return await TitleService.list(request, video_id)


class VideoImageView(JWTAuthMixin, View):
    async def get(self, request: HttpRequest, video_id) -> JsonResponse:
        return await ImageService.list(request, video_id)
