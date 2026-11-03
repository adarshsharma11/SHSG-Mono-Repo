import asyncio
import math

import psycopg

from shsg_api.core.settings import Settings
from shsg_api.schemas.migrations import MigrationStatus


async def read_migration_status(settings: Settings) -> MigrationStatus:
    """Read public Alembic tracking using a database-enforced read-only connection."""
    async with asyncio.timeout(settings.database_timeout_seconds):
        async with await psycopg.AsyncConnection.connect(
            host=settings.database_host,
            port=settings.database_port,
            dbname=settings.database_name,
            user=settings.database_user,
            password=settings.database_password.get_secret_value(),
            connect_timeout=max(2, math.ceil(settings.database_timeout_seconds)),
            options="-c default_transaction_read_only=on",
        ) as connection:
            cursor = await connection.execute("SELECT to_regclass('public.alembic_version')")
            row = await cursor.fetchone()
            if row is None or row[0] is None:
                return MigrationStatus(tracking_table_exists=False, applied_revisions=[])
            cursor = await connection.execute(
                "SELECT version_num FROM public.alembic_version ORDER BY version_num"
            )
            rows = await cursor.fetchall()
            return MigrationStatus(
                tracking_table_exists=True, applied_revisions=[str(row[0]) for row in rows]
            )
