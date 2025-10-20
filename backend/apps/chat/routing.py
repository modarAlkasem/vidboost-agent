# Django Imports
from django.urls import re_path

# App Imports
from .consumers import ChatConsumer

websocket_urlpatterns = [
    re_path(r"^ws/chat/(?P<session_id>[\w-]+)/$", ChatConsumer.as_asgi())
]
