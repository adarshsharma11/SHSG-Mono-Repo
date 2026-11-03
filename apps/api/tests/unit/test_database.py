import asyncio
from unittest.mock import AsyncMock, Mock

import pytest

from shsg_api.core.database import Database, check_database
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


async def test_database_owns_and_disposes_async_engine(
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    engine = Mock()
    engine.dispose = AsyncMock()
    create_engine = Mock(return_value=engine)
    monkeypatch.setattr("shsg_api.core.database.create_async_engine", create_engine)

    database = Database(Settings(database_password="p@ss:/% word's"))
    await database.dispose()

    url = create_engine.call_args.args[0]
    assert url.drivername == "postgresql+psycopg"
    assert url.password == "p@ss:/% word's"
    assert create_engine.call_args.kwargs["hide_parameters"] is True
    assert create_engine.call_args.kwargs["pool_pre_ping"] is True
    engine.dispose.assert_awaited_once()
