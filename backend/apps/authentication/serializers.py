# Python Imports
from typing import Any

# Django Imports
from django.contrib.auth.hashers import make_password, check_password
from django.db.transaction import atomic
from django.utils import timezone

# REST Framework Imports
from rest_framework import serializers

# Third-party Imports
from rest_framework_simplejwt.tokens import RefreshToken

# App Imports
from .models import User, Account, UserSecurityAuditLog
from .constants import (
    SignUpErrorCodeChoices,
    AccountProviderChoices,
    AccountTypeChoices,
    UserSecurityAuditLogTypeChoices,
)


class UserModelSerializer(serializers.ModelSerializer):

    def to_internal_value(self, data):
        email = data.get("email")

        if email:
            data["email"] = email.strip().lower()

        return super().to_internal_value(data)

    def validate_password(self, value) -> str:
        hashed_password = None

        if value:
            hashed_password = make_password(value)

        return hashed_password

    class Meta:
        model = User
        fields = "__all__"
        extra_kwargs = {"password": {"write_only": True}}


class SignUpModelSerializer(UserModelSerializer):
    email = serializers.EmailField()

    def validate_email(self, value) -> str:

        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError(
                "Invalid Email",
                SignUpErrorCodeChoices.EMAIL_ALREADY_EXISTING.value,
            )
        return value

    def create(self, validated_data):
        with atomic(durable=True):
            user: User = User.objects.create(**validated_data)

            account_data = {
                "provider": AccountProviderChoices.CREDENTIALS.value,
                "provider_account_id": user.id,
                "type": AccountTypeChoices.CREDENTIALS.value,
                "user": user,
            }

            Account.objects.create(**account_data)

        return user

    class Meta(UserModelSerializer.Meta):
        extra_kwargs = {"password": {"required": True}}


class SignInSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()
    ip_address = serializers.IPAddressField(required=False)
    user_agent = serializers.CharField()

    def to_internal_value(self, data):
        email = data.get("email")

        if email:
            data["email"] = email.strip().lower()

        return super().to_internal_value(data)

    def validate(self, attrs: dict[str, Any]):

        user = User.objects.filter(email=attrs.get("email")).first()
        audit_log_data = {
            "ip_address": attrs.get("ip_address"),
            "user_agent": attrs.get("user_agent"),
        }

        if not user:
            raise serializers.ValidationError({"email": "Invalid Email"})

        audit_log_data["user"] = user

        if not check_password(attrs.get("password"), user.password):
            audit_log_data["type"] = UserSecurityAuditLogTypeChoices.SIGN_IN_FAIL.value

            UserSecurityAuditLog.objects.create(**audit_log_data)
            raise serializers.ValidationError({"passowrd": "Invalid Password"})

        user.last_signed_in = timezone.now()
        user.save()

        audit_log_data["type"] = UserSecurityAuditLogTypeChoices.SIGN_IN.value
        UserSecurityAuditLog.objects.create(**audit_log_data)

        refresh_token = RefreshToken.for_user(user)
        access_token = str(refresh_token.access_token)

        return {
            "user": UserModelSerializer(instance=user).data,
            "tokens": {
                "access_token": access_token,
                "refresh_token": str(refresh_token),
            },
        }


class AccountModelSerializer(serializers.ModelSerializer):

    class Meta:
        model = Account
        fields = "__all__"


class AccountWithUserModelSerializer(AccountModelSerializer):
    user = UserModelSerializer()

    class Meta(AccountModelSerializer.Meta):
        pass


class SignInSocialModerSerializer(AccountWithUserModelSerializer):

    ip_address = serializers.IPAddressField(required=False)
    user_agent = serializers.CharField()

    def validate(self, attrs: dict[str, Any]):
        user = User.objects.filter(email=attrs.get("email")).first()
        audit_log_data = {
            "ip_address": attrs.get("ip_address"),
            "user_agent": attrs.get("user_agent"),
        }

        if not user:
            User.objects.create(**attrs.get("user"))

        else:
            for key, value in attrs.get("user").items():
                setattr(user, key, value)

            user.save()

        account = Account.objects.filter(
            provider=attrs.get("provider"),
            provider_account_id=attrs.get("provider_account_id"),
        ).first()

        if not account:
            attrs["user"] = user
            account = Account.objects.create(**attrs)

        audit_log_data["type"] = UserSecurityAuditLogTypeChoices.SIGN_IN_OAUTH.value
        UserSecurityAuditLog.objects.create(**audit_log_data)

        refresh_token = RefreshToken.for_user(user)
        access_token = str(refresh_token.access_token)

        return {
            "account": AccountWithUserModelSerializer(instance=account).data,
            "tokens": {
                "access_token": access_token,
                "refresh_token": str(refresh_token),
            },
        }

    class Meta(AccountWithUserModelSerializer.Meta):
        pass
