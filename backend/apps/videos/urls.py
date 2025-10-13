# Django Imports
from django.urls import path, include

# Third-Party Imports
from rest_framework_simplejwt.views import TokenRefreshView

# REST Framework Imports
from rest_framework.routers import DefaultRouter

# App Imports
from .views import VideoViewSet, VideoTitlesView, VideoImageView


router = DefaultRouter()
router.register("", VideoViewSet, basename="video")

urlpatterns = [
    path("", include(router.urls)),
    path("<uuid:video_id>/titles/", VideoTitlesView.as_view(), name="video-title-list"),
    path("<uuid:video_id>/images/", VideoImageView.as_view(), name="video-image-list"),
]
