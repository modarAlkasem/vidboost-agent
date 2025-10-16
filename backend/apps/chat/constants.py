# Django Imports
from django.db.models import TextChoices


class ChatMessageRoleChoices(TextChoices):
    SYSTEM = "system", "System"
    USER = "user", "User"
    ASSISTANT = "assistant", "Assistant"
