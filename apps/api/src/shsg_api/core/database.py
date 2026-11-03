import asyncio
import math
from collections.abc import AsyncIterator
from typing import cast

import psycopg
from fastapi import Request
from sqlalchemy import URL
from sqlalchemy.ext.asyncio import (
    AsyncEngine,
    AsyncSession,
    async_sessionmaker,
    create_async_engine,
)

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


class Database:
    """Application-owned async SQLAlchemy engine and session factory."""

    def __init__(self, settings: Settings) -> None:
        self.engine: AsyncEngine = create_async_engine(
            database_url(settings),
            connect_args={"connect_timeout": max(2, math.ceil(settings.database_timeout_seconds))},
            hide_parameters=True,
            pool_pre_ping=True,
        )
        self.sessions = async_sessionmaker(
            bind=self.engine,
            class_=AsyncSession,
            expire_on_commit=False,
        )

    async def dispose(self) -> None:
        await self.engine.dispose()


def get_database(request: Request) -> Database:
    """Return the database resources owned by the current FastAPI application."""
    return cast(Database, request.app.state.database)


async def get_session(request: Request) -> AsyncIterator[AsyncSession]:
    """Yield one transaction-capable session without committing implicitly."""
    database = get_database(request)
    async with database.sessions() as session:
        try:
            yield session
        except Exception:
            await session.rollback()
            raise


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
