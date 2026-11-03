from typing import Annotated

from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse

from shsg_api.core import get_settings
from shsg_api.core.settings import Settings
from shsg_api.schemas.health import HealthResponse, ReadinessResponse
from shsg_api.services.health import check_readiness

router = APIRouter(tags=["health"])


@router.get("/health")
def health() -> HealthResponse:
    return HealthResponse(status="ok")


@router.get(
    "/ready",
    response_model=ReadinessResponse,
    responses={503: {"model": ReadinessResponse}},
)
async def readiness(settings: Annotated[Settings, Depends(get_settings)]) -> JSONResponse:
    result = await check_readiness(settings)
    return JSONResponse(
        status_code=200 if result.status == "ready" else 503, content=result.model_dump()
    )
