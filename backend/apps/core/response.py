# Python Imports
from typing import Any, Union

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
