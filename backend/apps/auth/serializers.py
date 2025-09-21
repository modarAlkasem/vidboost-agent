# Django Imports
from django.contrib.auth.hashers import make_password

# REST Framework Imports
from rest_framework import serializers

# App Imports
from .models import User, Account


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
