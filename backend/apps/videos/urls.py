# Django Imports
from django.urls import path

# Third-Party Imports
from rest_framework_simplejwt.views import TokenRefreshView

# REST Framework Imports
from rest_framework.routers import DefaultRouter

# App Imports
from .views import VideoViewSet


router = DefaultRouter()
router.register("", VideoViewSet, basename="video")

urlpatterns = router.urls
