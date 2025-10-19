# Django Imports
from django.urls import path

# App Imports
from .views import ChatSessionView


urlpatterns = [path("sessions/", ChatSessionView.as_view(), name="chat-session")]
