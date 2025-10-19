# DRF Imports
from rest_framework import serializers

# App Imports
from .models import ChatSession, ChatMessage


class ChatSessionModelSerializer(serializers.ModelSerializer):

    class Meta:
        model = ChatSession
        fields = "__all__"


class ChatMessageModelSerializer(serializers.ModelSerializer):

    class Meta:
        model = ChatMessage
        fields = "__all__"
