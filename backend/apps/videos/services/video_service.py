"""
Business logic for video operations
"""

# Python Imports
from typing import Dict, Optional, Tuple
import logging

# REST Framework Imports
from rest_framework.request import Request
from rest_framework import status
from rest_framework.response import Response

# App Imports
from ..tasks import fetch_video_info_task
from ..serializer import CreateVideoSerializer


class VideoService:

    def create(self, request: Request) -> Response:
        """
        POST /api/videos/
        {
            "url":"https://www.youtube.com/watch?v=dQw4w9WgXcQ"
        }
        """
        try:
            serializer = CreateVideoSerializer(data=request.data)

        except:
            pass
