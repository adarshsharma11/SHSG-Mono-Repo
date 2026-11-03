import asyncio
from unittest.mock import AsyncMock

import pytest

from shsg_api.core.database import check_database
from shsg_api.core.settings import Settings


async def test_probe_closes_connection_and_preserves_special_password_characters(
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    connection = AsyncMock()
    connection.__aenter__.return_value = connection
    cursor = AsyncMock()
    cursor.fetchone.return_value = (1,)
    connection.execute.return_value = cursor
    connect = AsyncMock(return_value=connection)
    monkeypatch.setattr("shsg_api.core.database.psycopg.AsyncConnection.connect", connect)
    settings = Settings(database_password="p@ss:/% word's")
    assert await check_database(settings)
    assert connect.call_args.kwargs["password"] == "p@ss:/% word's"
    connection.execute.assert_awaited_once_with("SELECT 1")
    connection.__aexit__.assert_awaited_once()


async def test_probe_has_an_overall_deadline(monkeypatch: pytest.MonkeyPatch) -> None:
    async def slow_connect(**_kwargs: object) -> None:
        await asyncio.sleep(1)

    monkeypatch.setattr("shsg_api.core.database.psycopg.AsyncConnection.connect", slow_connect)
    with pytest.raises(TimeoutError):
        await check_database(Settings(database_timeout_seconds=0.01))
