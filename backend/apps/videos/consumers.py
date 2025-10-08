# Python Imports
import json
import logging

# Third Party Imports
from channels.generic.websocket import WebsocketConsumer
from channels.db import database_sync_to_async
from celery.result import AsyncResult


logger = logging.Logger(__name__)


class VideoWebsocketConsumer(WebsocketConsumer):
    """Websocket consumer for real-time Fetch Video Info Celery task updates"""

    async def connect(self):
        """Handle Websocket connections"""

        self.task_id = self.scope["url_route"]["kwargs"]["task_id"]
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

        await self.send_task_status()

    async def disconnect(self, close_code):
        """Handles Websocket disconnection"""

        logger.info(
            f"Websocket disconnected for task {self.task_id} with code {close_code}"
        )

        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    # async def receive(self, text_data):
    #     """Handles Websocket messages from client"""

    #     try:
    #         data = json.loads(text_data)
    #         action = data.get("action")

    #         if action == "get_status":
    #             await self.send_task_status()

    #         else:
    #             await self.send(
    #                 text_data=json.dumps(
    #                     {"type": "error", "message": f"Unknoow action {action}"}
    #                 )
    #             )
    #     except json.JSONDecodeError:
    #         await self.send(
    #             text_data=json.dumps({"type": "error", "message": "Invalid JSON"})
    #         )

    # async def send_task_status(self):
    #     """Get current task status from Celery and send to client"""
    #     task_status = await self.get_task_status()
    #     await self.send(text_data=json.dumps(task_status))

    # @database_sync_to_async
    # def get_task_status(self):
    #     """Getting the status of specific Celery task"""

    #     task = AsyncResult(self.task_id)

    #     response = {
    #         "type": "task_status",
    #         "status": task.status,
    #         "task_id": self.task_id,
    #     }

    #     match task.status:

    #         case "PENDING":
    #             response["message"] = "Task is waiting to be executed"

    #         case "STARTED":
    #             response["message"] = "Task is currently running"

    #         case "SUCCESS":
    #             response["message"] = "Task completed successfully"

    #         case "FAILURE":
    #             response["message"] = "Task failed"

    #         case "RETRY":
    #             response["message"] = "Task is being retried"

    #         case _:
    #             response["message"] = f"{str(task.info)}"

    #     return response

    async def task_update(self, event):
        """Receive task updates from Celery via channel layer"""

        await self.send(
            text_data=json.dumps(
                {
                    "type": "task_update",
                    "task_id": self.task_id,
                    "message": f"{event["message"]}",
                    "status": f"{event["status"]}",
                    "data": event.get("data"),
                }
            )
        )
