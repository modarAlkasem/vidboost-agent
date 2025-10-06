# REST Framework Imports
from rest_framework.request import Request
from rest_framework.viewsets import ViewSet

# Project Imports
from core.response import Response

# App Imports
from .services.video_service import VideoService


class VideoViewSet(ViewSet):
    """
    ViewSet for video CRUD operations
    """

    def create(self, request: Request) -> Response:
        return VideoService.create(request)
