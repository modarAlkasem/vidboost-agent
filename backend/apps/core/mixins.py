# REST Framework Imports
from rest_framework import status

# Third Party Imports
from rest_framework_simplejwt.tokens import AccessToken
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
from asgiref.sync import sync_to_async

# Project Imports
from authentication.models import User
from core.response import JsonResponse


class JWTAuthMixin:
    """Mixin for JWT authentication on async class-based views"""

    async def dispatch(self, request, *args, **kwargs):
        auth_result = await self.authenticate(request)

        if isinstance(auth_result, JsonResponse):
            return auth_result

        request.user = auth_result

        return await super().dispatch(request, *args, **kwargs)

    async def authenticate(self, request):
        """Authenticate the request using JWT"""

        auth_header = request.headers.get("Authorization", "")

        if not auth_header.startswith("Bearer "):
            return JsonResponse(
                data={"detail": "Authentication credentials were not provided"},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        token = auth_header.split(" ")[1]

        try:
            access_token = AccessToken(token)
            user_id = access_token["user_id"]

            @sync_to_async
            def get_user():
                try:
                    return User.objects.get(id=user_id)
                except User.DoesNotExist:
                    return None

            user = await get_user()

            if not user:
                JsonResponse(
                    data={"detail": "Invalid token"},
                    status=status.HTTP_401_UNAUTHORIZED,
                )

            return user
        except (InvalidToken, TokenError) as e:
            return JsonResponse(
                data={"detail": "Invalid or expired token"},
                status=status.HTTP_401_UNAUTHORIZED,
            )
