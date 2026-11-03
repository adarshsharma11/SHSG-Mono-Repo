import asyncio
import math

import psycopg
from sqlalchemy import URL

from shsg_api.core.settings import Settings


def database_url(settings: Settings) -> URL:
    """Build a driver URL without interpolation or manual password escaping."""
    return URL.create(
        "postgresql+psycopg",
        username=settings.database_user,
        password=settings.database_password.get_secret_value(),
        host=settings.database_host,
        port=settings.database_port,
        database=settings.database_name,
    )


async def check_database(settings: Settings) -> bool:
    """Probe the configured database without changing schema or retaining a connection."""
    # The outer deadline also bounds DNS, authentication, and query execution.
    async with asyncio.timeout(settings.database_timeout_seconds):
        async with await psycopg.AsyncConnection.connect(
            host=settings.database_host,
            port=settings.database_port,
            dbname=settings.database_name,
            user=settings.database_user,
            password=settings.database_password.get_secret_value(),
            connect_timeout=max(2, math.ceil(settings.database_timeout_seconds)),
            autocommit=True,
        ) as connection:
            cursor = await connection.execute("SELECT 1")
            return await cursor.fetchone() == (1,)
