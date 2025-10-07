# Django Imports
from django.urls import re_path

# App Imports
from .consumers import VideoWebsocketConsumer

websocket_urlpatterns = [
    re_path(r"ws/videos/tasks/(?P<task_id>[\w-]+)/$", VideoWebsocketConsumer.as_asgi())
]
