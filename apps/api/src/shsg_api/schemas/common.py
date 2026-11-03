from typing import Any, Self

from pydantic import BaseModel, model_validator


class ApiError(BaseModel):
    code: str
    message: str
    details: list[dict[str, Any]] | None = None


class ApiResponse[T](BaseModel):
    """Consistent transport envelope for future SHSG business endpoints."""

    success: bool
    data: T | None = None
    error: ApiError | None = None
    message: str | None = None

    @model_validator(mode="after")
    def validate_success_error_shape(self) -> Self:
        if self.success and self.error is not None:
            raise ValueError("A successful response cannot contain an error")
        if not self.success and self.error is None:
            raise ValueError("An unsuccessful response must contain an error")
        if not self.success and self.data is not None:
            raise ValueError("An unsuccessful response cannot contain data")
        return self

    @classmethod
    def ok(cls, data: T, *, message: str | None = None) -> Self:
        return cls(success=True, data=data, message=message)

    @classmethod
    def fail(
        cls,
        *,
        code: str,
        message: str,
        details: list[dict[str, Any]] | None = None,
    ) -> Self:
        return cls(
            success=False,
            error=ApiError(code=code, message=message, details=details),
        )
