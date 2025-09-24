# Django Imports
from django.urls import path

# Third-Party Imports
from rest_framework_simplejwt.views import TokenRefreshView

# REST Framework Imports
from rest_framework.routers import DefaultRouter

# App Imports
from .views import AuthViewSet

router = DefaultRouter()
router.register("", AuthViewSet, basename="auth")

urlpatterns = router.urls
urlpatterns.append(
    path("token/refresh/", TokenRefreshView.as_view(), name="refresh-token"),
)
