# Python Imports
import importlib
import os

# Django Imports
from django.db.models import Model


def get_generated_video_image_path(instance: Model, file_name: str) -> str:

    image_model_cls = importlib.import_module("videos.models").Image

    if isinstance(instance, image_model_cls):
        ext = os.path.splitext(file_name)[1]
        timestamp_str = "%Y-%m-%d_%H:%M:%S"

        return f"{instance.video.user.id}/video-thumbnails/{timestamp_str}.{ext}"

    raise TypeError("'instance' arg isn't of type 'videos.Image' model")
