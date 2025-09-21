# REST Framework Imports
from rest_framework.routers import DefaultRouter

# App Imports
from .views import AuthViewSet

router = DefaultRouter()
router.register("", AuthViewSet, basename="auth")

urlpatterns = router.urls
