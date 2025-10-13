# Python Imports
import json
import logging

# Third Party Imports
from channels.generic.websocket import AsyncWebsocketConsumer


# App Imports
from .tasks import fetch_video_info_task


logger = logging.Logger(__name__)


class VideoWebsocketConsumer(AsyncWebsocketConsumer):
    """Websocket consumer for real-time Fetch Video Info Celery task updates"""

    async def connect(self):
        """Handle Websocket connections"""

        task = fetch_video_info_task.delay(
            self.scope["url_route"]["kwargs"]["video_id"]
        )
        self.task_id = task.id
        self.room_group_name = f"task_{self.task_id}"

        await self.channel_layer.group_add(self.room_group_name, self.channel_name)

        await self.accept()

        logger.info(f"Websocket connection opend for {self.task_id}")

        await self.send(
            text_data=json.dumps(
                {
                    "type": "connection",
                    "task_id": self.task_id,
                    "message": "Connected to task updates",
                    "status": "connected",
                }
            )
        )

    async def disconnect(self, close_code):
        """Handles Websocket disconnection"""

        logger.info(
            f"Websocket disconnected for task {self.task_id} with code {close_code}"
        )

        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    async def task_update(self, event):
        """Receive task updates from Celery via channel layer"""

        await self.send(
            text_data=json.dumps(
                {
                    "type": "task_update",
                    "task_id": self.task_id,
                    "message": f'{event.get("message")}',
                    "status": f'{event.get("status")}',
                    "data": event.get("data"),
                }
            )
        )
