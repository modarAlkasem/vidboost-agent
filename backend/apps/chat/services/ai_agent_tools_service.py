"""
Service defines Tools called by AI Agent
"""

# Python Imports
import logging
from typing import Optional, List, Dict

# Third Party Imports
from botocore.exceptions import ClientError
from langchain.tools import Tool

# App Imports
from .image_generation_service import ImageGenerationService

# Project Imports
from videos.models import Video
from videos.services.youtube_service import YouTubeService


logger = logging.Logger(__name__)


class AIAgentToolsService:

    def __init__(self, video: Optional[Video] = None):
        self.video = video
        self.youtube_service = YouTubeService
        self.image_generation = ImageGenerationService

    def get_video_info(self, query: str = "") -> str:
        """Fetch video info (title, views, likes, comments,etc)"""

        try:
            video_info = self.youtube_service.fetch_video_info(
                self.video.provider_video_id
            )

            return f"""
                    Video Information:
                    - Title: {video_info.get("title")}
                    - Description: {video_info.get("description")}
                    - Duration: {video_info.get("duration")}
                    - Views: {video_info.get("view_count")}
                    - Likes: {video_info.get("like_count")}
                    - Comments: {video_info.get("comment_count")}
                    - Published: {video_info.get("published_at")}
                    - Channel: {video_info.get("channel").get("name")}
                    """

        except Exception as e:
            return f" Error fetching video info: {str(e)}"

    def get_transcript(self, query: str = "") -> str:
        """Fetch video transcript"""

        try:
            if self.video.related_transcript:
                video_transcript = self.video.related_transcript
            else:
                video_transcript = self.youtube_service.fetch_transcript(
                    self.video.provider_video_id
                ).get("transcript")

            return f"Full Transcript: (en:\n\n {video_transcript})"

        except Exception as e:
            return f" Error fetching video transcript: {str(e)}"

    def generate_image(self, prompt: str) -> str:
        """Generate video's thumbnail"""

        try:
            img_url = self.image_generation.generate_with_hugginface(
                prompt, self.video.id, self.video.user.id
            )

            return f"Image generated successfully! URL: {img_url}"

        except (ClientError, Exception) as e:
            return f" Error generating video's thumbnail : {str(e)}"

    def get_tool_list(self) -> List[Tool]:
        """Return list of LangChain tools"""

        return [
            Tool(
                name="get_video_info",
                func=self.get_video_info,
                description="Fetch current Youtube video information including title, description, views,likes, comments,channel's name. use this when user asks about video state or metadata.",
            ),
            Tool(
                name="get_video_transcript",
                func=self.get_transcript,
                description="Fetch current video transcription. Use this when user asks to analyze content, generate summaries,generate video thumbnail or create script based on the video.",
            ),
            Tool(
                name="generate_image",
                func=self.generate_image,
                description="Generating YouTube video thumbnail using AI. Input should be detailed description about the desired image. Use this tool when user asks to generate video thumbnails.",
            ),
        ]
