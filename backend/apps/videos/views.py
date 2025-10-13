# REST Framework Imports
from rest_framework.request import Request
from rest_framework.viewsets import ViewSet
from rest_framework.decorators import action

# Project Imports
from core.response import Response

# App Imports
from .services.video_service import VideoService
from .services.title_service import TitleService


class VideoViewSet(ViewSet):
    """
    ViewSet for video CRUD operations
    """

    def create(self, request: Request) -> Response:
        return VideoService.create(request)

    @action(detail=True, methods=["GET"], url_path="titles")
    async def titles(self, request: Request, pk: str) -> Response:
        return await TitleService.list(request, pk)
