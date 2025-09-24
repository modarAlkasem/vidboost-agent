from django.db import models


class TimeStampMixin(models.Model):
    created_at = models.DateTimeField("created at", blank=True, auto_now_add=True)
    updated_at = models.DateTimeField("updated at", blank=True, auto_now=True)

    class Meta:
        abstract = True
