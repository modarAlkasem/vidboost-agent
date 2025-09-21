# REST Framework Imports
from rest_framework.request import Request
from rest_framework.viewsets import ViewSet
from rest_framework.decorators import action

# Project Imports
from core.response import Response

# App Imports
from .services import AuthService


class AuthViewSet(ViewSet):
    service = AuthService()

    @action(methods=["POST"], detail=False, url_name="signup", url_path="signup")
    def sign_up(self, request: Request) -> Response:
        return self.service.sign_up(request)
