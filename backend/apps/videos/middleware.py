# Python Imports
from urllib.parse import parse_qs
from typing import Optional


# Third Party Imports

from channels.middleware import BaseMiddleware
from rest_framework_simplejwt.tokens import AccessToken
from rest_framework_simplejwt.exceptions import (
    InvalidToken,
    TokenError,
    AuthenticationFailed,
)

# Project Imports
from authentication.models import User


class JWTAuthMiddleware(BaseMiddleware):

    def get_raw_token(self, scope) -> Optional[str]:
        query_string = scope.get("query_string", b"").decode("utf-8")
        params = parse_qs(query_string)

        try:
            token = params["token"][0]
            return token
        except KeyError as e:
            raise AuthenticationFailed("Token not provided")

    def get_validated_token(self, raw_token: bytes) -> AccessToken:
        try:
            return AccessToken(raw_token)
        except TokenError as e:
            raise InvalidToken(e.args[0])

    async def get_user(self, validated_token: AccessToken) -> User:
        try:
            user_id = validated_token["user_id"]
        except KeyError as e:
            raise InvalidToken("Token contained no recognizable user identification")

        try:
            user = await User.objects.aget(id=user_id)
        except User.DoesNotExist as e:
            raise AuthenticationFailed("User not found")

        if user.disabled:
            raise AuthenticationFailed("User disabled")

        return user

    async def __call__(self, scope, receive, send):

        try:
            raw_token = self.get_raw_token(scope)

            validated_token = self.get_validated_token(raw_token)

            scope["user"] = await self.get_user(validated_token)

            return await super().__call__(scope, receive, send)

        except Exception as e:
            print(e)
            await send({"type": "websocket.close", "code": 4001, "reason": str(e)})

            return
