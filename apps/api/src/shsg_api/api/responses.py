from typing import Any

from fastapi.responses import JSONResponse

from shsg_api.schemas.common import ApiResponse


def api_error_response(
    *,
    status_code: int,
    code: str,
    message: str,
    headers: dict[str, str] | None = None,
    details: list[dict[str, Any]] | None = None,
) -> JSONResponse:
    payload = ApiResponse[None].fail(code=code, message=message, details=details)
    return JSONResponse(
        status_code=status_code,
        content=payload.model_dump(mode="json"),
        headers=headers,
    )
