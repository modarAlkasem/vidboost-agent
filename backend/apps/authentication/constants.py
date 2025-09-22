# Django Imports
from django.db.models import TextChoices


class AccountTypeChoices(TextChoices):
    CREDENTIALS = "CREDENTIALS"
    OAUTH = "OAUTH"


class AccountProviderChoices(TextChoices):
    CREDENTIALS = "credentials"
    GOOGLE = "google"


class OAuthProviderChoices(TextChoices):
    GOOGLE = "google"


class UserSecurityAuditLogTypeChoices(TextChoices):
    SIGN_IN = "SIGN_IN"
    SIGN_IN_OAUTH = "SIGN_IN_OUATH"
    SIGN_OUT = "SIGN_OUT"
    SIGN_IN_FAIL = "SIGN_IN_FAIL"
    SIGN_IN_OAUTH_FAIL = "SIGN_IN_OAUTH_FAIL"


class SignUpErrorCodeChoices(TextChoices):
    EMAIL_ALREADY_EXISTING = "EMAIL_ALREADY_EXISTING"
