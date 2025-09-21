# Python Imports
import uuid

# Django Imports
from django.db import models

# Project Imports
from core.models import TimeStampMixin

# App Imports
from .constants import (
    AccountTypeChoices,
    AccountProviderChoices,
    UserSecurityAuditLogTypeChoices,
)


class User(TimeStampMixin):
    name = models.CharField("name", max_length=150, blank=True, null=True)
    email = models.EmailField("email", blank=True, unique=True)
    password = models.CharField("password", max_length=128, blank=True, null=True)
    verified_at = models.DateTimeField("verified at", blank=True, null=True)
    last_signed_in = models.DateTimeField("last signed in", blank=True, null=True)
    disabled = models.BooleanField("disabled", default=False)

    REQUIRED_FIELDS = ()
    USERNAME_FIELD = "email"
    is_anonymous = False
    is_authenticated = False


class Account(TimeStampMixin):
    id = models.UUIDField("ID", primary_key=True, editable=False, default=uuid.uuid4)
    user = models.ForeignKey(
        User,
        verbose_name="user",
        on_delete=models.CASCADE,
        related_name="accounts",
        related_query_name="account",
        blank=True,
    )
    type = models.CharField(
        "type",
        choices=AccountTypeChoices.choices,
        max_length=50,
        blank=True,
    )
    provider = models.CharField(
        "provider", max_length=11, choices=AccountProviderChoices.choices, blank=True
    )
    provider_account_id = models.CharField("provider ID", max_length=255, blank=True)
    token_type = models.CharField("token type", max_length=10, blank=True, null=True)
    scope = models.TextField("scope", blank=True, null=True)
    id_token = models.TextField("ID Token", blank=True, null=True)

    class Meta:
        verbose_name = "account"
        verbose_name_plural = "accounts"
        constraints = [
            models.UniqueConstraint(
                fields=[
                    "provider",
                    "provider_account_id",
                ],
                name="provider__provider_account_id",
            )
        ]


class UserSecurityAuditLog(models.Model):
    user = models.ForeignKey(
        User,
        verbose_name="user",
        related_name="security_audit_logs",
        related_query_name="security_audit_log",
        on_delete=models.CASCADE,
    )
    type = models.CharField(
        "type", choices=UserSecurityAuditLogTypeChoices.choices, max_length=50
    )
    ip_address = models.GenericIPAddressField("IP address")
    user_agent = models.TextField("user agent")
    created_at = models.DateTimeField(
        "created at",
        auto_now_add=True,
    )

    class Meta:
        verbose_name = "user security audit log"
        verbose_name_plural = "user security audit logs"
