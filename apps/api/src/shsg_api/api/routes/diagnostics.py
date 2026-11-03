from typing import Annotated

import psycopg
from fastapi import APIRouter, Depends, HTTPException

from shsg_api.core import get_settings
from shsg_api.core.settings import Settings
from shsg_api.schemas.migrations import MigrationStatus
from shsg_api.services.migrations import get_migration_status

router = APIRouter(prefix="/internal", tags=["development diagnostics"])


@router.get("/migrations", response_model=MigrationStatus, include_in_schema=False)
async def migration_status(settings: Annotated[Settings, Depends(get_settings)]) -> MigrationStatus:
    if settings.environment != "local" or not settings.enable_dev_diagnostics:
        raise HTTPException(status_code=404, detail="Not found")
    try:
        return await get_migration_status(settings)
    except (psycopg.Error, TimeoutError, OSError) as error:
        raise HTTPException(status_code=503, detail="Migration status is unavailable") from error
