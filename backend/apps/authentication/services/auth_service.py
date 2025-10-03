# REST Framework Imports
from rest_framework.request import Request
from rest_framework import status
from rest_framework.serializers import ValidationError

# Project Imports
from core.response import Response

# Third-Party Imports
from rest_framework_simplejwt.tokens import RefreshToken

# App Imports
from ..serializers import (
    SignUpModelSerializer,
    UserModelSerializer,
    SignInSerializer,
    SignInSocialModerSerializer,
    SignOutSerializer,
)
from ..constants import SignUpErrorCodeChoices, SignInErrorCodeChoices


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
                    if error.code == SignUpErrorCodeChoices.EMAIL_ALREADY_EXISTS.value:
                        response["status_text"] = error.code

        return Response(**response)

    def sign_in(self, request: Request) -> Response:
        data = request.data
        response = {}
        serializer = SignInSerializer(data=data)
        try:
            if serializer.is_valid(raise_exception=True):
                response = {
                    "data": serializer.validated_data,
                }

        except ValidationError as e:

            response = {
                "data": e.detail,
                "status_code": status.HTTP_400_BAD_REQUEST,
                "status_text": "BAD_REQUEST",
            }

            [_, [error_detail]] = list(e.detail.items())[0]
            if error_detail.code in SignInErrorCodeChoices.values:
                response["status_text"] = error_detail.code

        return Response(**response)

    def sign_in_social(self, request: Request) -> Response:
        data = request.data
        serializer = SignInSocialModerSerializer(data=data)

        if serializer.is_valid(raise_exception=True):
            return Response(data=serializer.validated_data)

    def sign_out(self, request: Request) -> Response:
        data = request.data
        print(request.data)
        serializer = SignOutSerializer(data=data)

        serializer.is_valid(raise_exception=True)

        refresh_token = RefreshToken(serializer.validated_data["refresh_token"].token)
        refresh_token.blacklist()

        return Response(data={})
