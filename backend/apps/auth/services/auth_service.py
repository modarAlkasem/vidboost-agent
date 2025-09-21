# REST Framework Imports
from rest_framework.request import Request
from rest_framework import status
from rest_framework.serializers import ValidationError

# Project Imports
from core.response import Response

# App Imports
from ..serializers import SignUpModelSerializer, UserModelSerializer
from ..constants import SignUpErrorCodeChoices


class AuthService:

    def sign_up(self, request: Request, **kwargs) -> Response:
        data = request.data
        response = {}
        serializer = SignUpModelSerializer(data=data)

        try:
            serializer.is_valid(raise_exception=True)
            user = serializer.save()
            response = {
                "data": UserModelSerializer(instance=user).data,
                "status_code": status.HTTP_201_CREATED,
                "status_text": "CREATED",
            }

        except ValidationError as e:
            response = {
                "data": e.detail,
                "status_code": status.HTTP_400_BAD_REQUEST,
                "status_text": "BAD_REQUEST",
            }
            if "email" in e.detail:
                for error in e.detail["email"]:
                    if (
                        error.code
                        == SignUpErrorCodeChoices.EMAIL_ALREADY_EXISTING.value
                    ):
                        response["status_text"] = error.code

            return response
