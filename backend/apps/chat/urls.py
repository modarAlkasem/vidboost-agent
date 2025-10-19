# Django Imports
from django.urls import path

# App Imports
from .views import ChatSessionView, ChatMessageView


urlpatterns = [
    path("sessions/", ChatSessionView.as_view(), name="chat-session"),
    path(
        "sessions/<uuid:session_id>/messages/",
        ChatMessageView.as_view(),
        name="chat-message",
    ),
]
