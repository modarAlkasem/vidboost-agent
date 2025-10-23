# Python Imports
from typing import Any, Union

# Django Imports
from django.http import JsonResponse as DjangoJsonResponse
from django.core.serializers.json import DjangoJSONEncoder

# REST Framework Imports
from rest_framework.response import Response as DRFResponse


class Response(DRFResponse):

    _status_text = "SUCCESS"

    def __init__(
        self,
        data: Any = None,
        status_code: Union[int, None] = None,
        status_text: Union[str, None] = None,
        template_name: Union[str, None] = None,
        headers: Union[dict, None] = None,
        content_type: Union[str, None] = None,
    ):
        if status_text:
            self._status_text = status_text

        super().__init__(
            data,
            status=status_code,
            template_name=template_name,
            headers=headers,
            content_type=content_type,
        )

    @property
    def status_text(self):
        return self._status_text


class JsonResponse(DjangoJsonResponse):

    def __init__(
        self,
        data,
        encoder=DjangoJSONEncoder,
        safe=True,
        json_dumps_params=None,
        **kwargs
    ):
        status_code = kwargs.get("status")
        status_text = kwargs.get("status_text", "SUCCESS")
        wrapped_data = {
            "status_code": status_code,
        }

        if status_code < 400:
            wrapped_data["data"] = data
        else:
            wrapped_data["errors"] = data

        if status_text == "SUCCESS" and status_code >= 500:
            status_text = "UNKNOWN_ERROR"

        elif status_text == "SUCCESS" and status_code >= 400:
            status_text = "BAD_REQUEST"

        wrapped_data["status_text"] = status_text

        super().__init__(wrapped_data, encoder, safe, json_dumps_params, **kwargs)
