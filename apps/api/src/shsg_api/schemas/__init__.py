"""Pydantic request and response contracts, independent of persistence models."""

from shsg_api.schemas.common import ApiError, ApiResponse

__all__ = ["ApiError", "ApiResponse"]
