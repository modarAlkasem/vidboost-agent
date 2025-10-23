"""
Service defines Tools called by AI Agent
"""

# Python Imports
import logging
from typing import Optional, List, Annotated

# Third Party Imports
from requests.exceptions import HTTPError
from langchain_core.tools import StructuredTool

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
        """Fetch current Youtube video information including title, description, views,likes, comments,channel's name. use this when user asks about video state or metadata."""

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

    def get_transcript(self) -> str:
        """Fetch current video transcription. Use this when user asks to analyze content, generate summaries,generate video thumbnail or create script based on the video."""

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

    def generate_image(
        self, prompt: Annotated[str, "Detailed description about the desired image.ed "]
    ) -> dict:
        # """Generating YouTube video thumbnail using AI. Use this tool when user asks to generate video thumbnails. Then you must call upload_generated_image tool for uploading/saving the image and getting it's URL"""

        """Generating YouTube video thumbnail using AI. Use this tool when user asks to generate video thumbnails."""

        try:
            img = self.image_generation.generate_with_hugginface(prompt, self.video)

            return {
                "output": "Image generated successfully",
                "artifacts": {"img_data": img},
            }

        except HTTPError as e:
            return f" Error generating video's thumbnail : {str(e)}"

    def get_tool_list(self) -> List[StructuredTool]:
        """Return list of LangChain tools"""
        StructuredTool.from_function(
            self.get_video_info, name="get_video_info", infer_schema=True
        )
        return [
            StructuredTool.from_function(
                self.get_video_info, name="get_video_info", infer_schema=True
            ),
            StructuredTool.from_function(
                self.get_transcript, name="get_transcript", infer_schema=True
            ),
            StructuredTool.from_function(
                self.generate_image, name="generate_image", infer_schema=True
            ),
        ]
