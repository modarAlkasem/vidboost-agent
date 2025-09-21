# Django Imports
from django.contrib.auth.hashers import make_password
from django.db.transaction import atomic

# REST Framework Imports
from rest_framework import serializers

# App Imports
from .models import User, Account
from .constants import (
    SignUpErrorCodeChoices,
    AccountProviderChoices,
    AccountTypeChoices,
)


class UserModelSerializer(serializers.ModelSerializer):

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

        if not User.objects.filter(email=value).exists():
            raise serializers.ValidationError(
                {"email": "Invalid Email"},
                SignUpErrorCodeChoices.EMAIL_ALREADY_EXISTING.value,
            )

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
