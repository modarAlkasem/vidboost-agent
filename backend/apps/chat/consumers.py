# Python Imports
import json
import logging

# Third Party Imports
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async

# App Imports
from .services.ai_agent_service import AIAgentService
from .models import ChatSession

logger = logging.Logger(__name__)


class ChatConsumer(AsyncWebsocketConsumer):
    """Websocket consumer for AI Agent chat streaming"""

    async def connect(self):

        self.session_id = self.scope["url_route"]["kwargs"]["session_id"]
        self.room_group_name = f"chat_{self.session_id}"

        session_obj = await self.get_session()
        if not session_obj:

            await self.close(code=4001)
            return

        await self.channel_layer.group_add(self.room_group_name, self.channel_name)

        await self.accept()
        logger.info(f"Websocket connection opend for {self.session_id}")
        await self.send(
            text_data=json.dumps(
                {
                    "type": "connection",
                    "session_id": self.session_id,
                    "message": "Connected to AI Agent Chat",
                    "status": "connected",
                }
            )
        )

    async def disconnect(self):
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    async def receive(self, text_data: str):
        """Hnadle incoming messages from user"""

        data = json.loads(text_data)
        message = data.get("message")

        if not message:
            return

        session = await self.get_session()
        if not session:
            await self.send(
                json.dumps({"type": "error", "message": "Session not found"})
            )

            return

        agent_service = await AIAgentService.create(session=session)

        try:
            async for chunk in agent_service.stream_message(message):
                await self.send(json.dumps({"type": "message_chunk", "content": chunk}))

            await self.send(
                json.dumps(
                    {
                        "type": "message_complete",
                    }
                )
            )
        except Exception as e:
            await self.send(json.dumps({"type": "error", "message": str(e)}))

    @database_sync_to_async
    def get_session(self):
        try:
            session = ChatSession.objects.get(
                id=self.session_id, user=self.scope.get("user")
            )
            return session

        except ChatSession.DoesNotExist as e:
            return None
