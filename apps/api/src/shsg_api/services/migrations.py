from shsg_api.core.settings import Settings
from shsg_api.repositories.migrations import read_migration_status
from shsg_api.schemas.migrations import MigrationStatus


async def get_migration_status(settings: Settings) -> MigrationStatus:
    return await read_migration_status(settings)
