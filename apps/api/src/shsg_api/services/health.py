import psycopg

from shsg_api.core.database import check_database
from shsg_api.core.settings import Settings
from shsg_api.schemas.health import ReadinessResponse


async def check_readiness(settings: Settings) -> ReadinessResponse:
    try:
        ready = await check_database(settings)
    except (psycopg.Error, TimeoutError, OSError):
        # Keep private driver errors and connection details out of public responses.
        ready = False
    return ReadinessResponse(
        status="ready" if ready else "not_ready", database="ok" if ready else "unavailable"
    )
