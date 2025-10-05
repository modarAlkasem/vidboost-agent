# Python Imports
from typing import Dict, Optional, List
import logging

# Third Party Imports
import yt_dlp
from youtube_transcript_api import YouTubeTranscriptApi


logger = logging.getLogger(__name__)


class YouTubeService:
    """
    Service for fetching YouTube video data
    """
