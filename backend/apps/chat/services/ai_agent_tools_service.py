"""
Service defines Tools called by AI Agent
"""

# Python Imports
import logging
from typing import Optional, List, Dict

# App Imports
from .image_generation_service import ImageGenerationService

# Project Imports
from videos.models import Video
from videos.services.youtube_service import YouTubeService


logger = logging.Logger(__name__)


class AIAgentToolsService:

    def __init__(self, video: Optional[Video] = None):
        self.video = video
        self.youtube_service = ImageGenerationService
        self.image_generation = YouTubeService
