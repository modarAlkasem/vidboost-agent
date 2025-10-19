# Python Imports
from typing import List, Optional, Dict
import logging

# Third Party Imports
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.messages import HumanMessage, AIMessage, SystemMessage
from langchain.agents import AgentExecutor, create_openai_functions_agent
from langchain.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain.memory import ConversationBufferMemory

from asgiref.sync import sync_to_async

# Django Imports
from django.conf import settings

# Project Imports
from videos.services.youtube_service import YouTubeService

# App Imports
from ..models import ChatSession, ChatMessage
from .ai_agent_tools_service import AIAgentToolsService
from ..constants import ChatMessageRoleChoices

logger = logging.Logger(__name__)


class AIAgentService:
    """
    Service for managing AI Agent conversations
    """

    async def __init__(self, session: ChatSession):
        self.session = session
        self.video = session.video

        self.llm = ChatGoogleGenerativeAI(
            model="gemini-2.5-flash",
            google_api_key=settings.GOOGLE_API_KEY,
            temperature=0.7,
        )

        self.tools = AIAgentToolsService(self.video)

        self.system_prompt = await self._create_system_prompt()

    async def _create_system_prompt(self) -> str:
        """Create a system prompt based on current video context"""

        video_info = sync_to_async(YouTubeService.fetch_video_info)(
            self.video.provider_video_id
        )

        base_prompt = f""" 
            You are VidBoost AI Agent. an expert video content assistant. You help content creators optimize their YouTube videos by:

            1. Analyzing video content and transcript
            2. Generating engaging titles, scripts and thumbnails
            3. Providing insights on video performance

            Guidelines:
            - Be helpful, concise and actionable
            - Refere to video by it's title
            - Use emojis to more conversation more engaging
            - If error occurs, explain it to user and ask them to retry again later.
            - If the error suggest the user upgrade, explain that they must upgrade to use this feature, tell them to go to 'Manage Plan' in the header and upgrade.
            - When generating titles, amke them engaging and SEO-friendly (50 - 60 characters)
            - When creating thumbnails, describe visual elements clearly
            - Always base suggestions on actual video content when available
            -  If any tool is used analyze the response and if it contains cache then explain that the result is cached not new one saving user token
            - Always format your responses for notion

            Video Context:
            - Video ID: {self.video.id}
            - Video Title: {video_info.get("title")}

        """

        return base_prompt

    async def _load_chat_history(self) -> List:
        """Load messages from database"""

        messages = []

        for message in await sync_to_async(list)(
            ChatMessage.objects.filter(session=self.session)
        ):
            if message.role == ChatMessageRoleChoices.USER.value:
                messages.append(HumanMessage(content=message.content))
            else:
                messages.append(AIMessage(content=message.content))

        return messages

    async def _save_message(
        self, role: str, content: str, tool_calls: Optional[List[str]] = None
    ) -> ChatMessage:
        """Save message to database"""

        return await ChatMessage.objects.create(
            role=role,
            content=content,
            tool_calls=tool_calls or [],
            session=self.session,
        )

    def create_agent(self) -> AgentExecutor:
        prompt = ChatPromptTemplate.from_messages[
            SystemMessage(content=self.system_prompt),
            MessagesPlaceholder(variable_name="chat_history"),
            ("human", {"input"}),
            MessagesPlaceholder(variable_name="agent_scratchpad"),
        ]

        agent = create_openai_functions_agent(
            llm=self.llm, tools=self.tools.get_tool_list(), prompt=prompt
        )

        agent_executor = AgentExecutor(
            agent=agent,
            tools=self.tools.get_tool_list(),
            verbose=True,
            return_intermediate_steps=True,
            max_iterations=5,
        )

        return agent_executor

    async def proccess_message(self, user_message: str) -> Dict:
        """
        Proccess user message and return agent response

        Args:
            user_message: User's prompt

        Returns:
            {
                'message': str,
                'tool_calls': list
            }
        """

        await self._save_message(content=user_message, role="user")

        chat_history = await self._load_chat_history()

        agent = self.create_agent()

        try:
            result = await agent.ainvoke(
                {"input": user_message, "chat_history": chat_history}
            )

            response_text = result.get("output")
            intermediate_steps = result.get("intermediate_steps", [])

            tool_calls = []
            for step in intermediate_steps:
                if len(step) >= 2:
                    action, observation = step[0], step[1]
                    tool_calls.append(
                        {
                            "tool": action.tool,
                            "input": action.tool_input,
                            "output": observation,
                        }
                    )

            assistant_message = await self._save_message(
                role=ChatMessageRoleChoices.ASSISTANT.value,
                content=response_text,
                tool_calls=tool_calls,
            )

            return {
                "message": response_text,
                "tool_calls": tool_calls,
                "message_id": str(assistant_message.id),
            }
        except Exception as e:
            logger.error(f"Error processing message: {e}")
            raise Exception(str(e))

    async def stream_message(self, user_message: str):
        """
        Stream agent response token by token (for WebSocket)
        Yields chunks of text as they're generated
        """

        await self._save_message(content=user_message, role="user")

        chat_history = await self._load_chat_history()

        agent = self.create_agent()

        full_response = ""

        try:
            async for chunk in agent.astream(
                {"input": user_message, "chat_history": chat_history}
            ):
                if "output" in chunk:
                    text = chunk.get("output")
                    full_response += text
                    yield text

            await self._save_message(
                role=ChatMessage.Role.ASSISTANT, content=full_response
            )
        except Exception as e:
            logger.error(f"Error streaming message: {e}")
            yield f"Error: {str(e)}"
