# Python Imports
from typing import Union
from datetime import datetime

# Django Imports
from django.utils import timezone

# Third-Party Imports
from jose import jwt
from jose.exceptions import JWTError
import requests

# REST Framework Imports
from rest_framework import settings

# App Imports
from .constants import AccountProviderChoices, AccountTypeChoices


def validate_google_id_token(token: str) -> Union[dict, None]:
    GOOGLE_JWKS_URL = "https://www.googleapis.com/oauth2/v3/certs"

    try:
        jwks = requests.get(GOOGLE_JWKS_URL).json()
        claims = jwt.decode(
            token=token,
            key=jwks,
            algorithms=["RS256"],
            audience=settings.OAUTH_PROVIDERS["google"]["client_id"],
        )
        return {
            "user": {
                "name": (
                    claims.get("name")
                    if claims.get("name")
                    else f"{claims.get("given_name")} {claims.get("family_name")}"
                ),
                "email": claims.get("email"),
                "email_verified": claims.get("email_verified"),
                "picture": claims.get("picture"),
                "last_signed_in": timezone.now(),
            },
            "provider_account_id": claims.get("sub"),
            "provider": AccountProviderChoices.GOOGLE.value,
            "id_token": token,
            "type": AccountTypeChoices.OAUTH.value,
            "expires_at": datetime.utcfromtimestamp(claims.get("exp")),
        }

    except JWTError:
        return None
