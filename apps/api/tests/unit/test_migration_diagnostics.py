from unittest.mock import AsyncMock

import pytest

from shsg_api.core.settings import Settings
from shsg_api.repositories.migrations import read_migration_status


@pytest.mark.parametrize("exists", [False, True])
async def test_migration_diagnostics_use_read_only_connection(
    exists: bool, monkeypatch: pytest.MonkeyPatch
) -> None:
    connection = AsyncMock()
    connection.__aenter__.return_value = connection
    cursor = AsyncMock()
    cursor.fetchone.return_value = ("alembic_version" if exists else None,)
    cursor.fetchall.return_value = [("0001_baseline",)]
    connection.execute.return_value = cursor
    connect = AsyncMock(return_value=connection)
    monkeypatch.setattr("shsg_api.repositories.migrations.psycopg.AsyncConnection.connect", connect)
    result = await read_migration_status(Settings())
    assert connect.call_args.kwargs["options"] == "-c default_transaction_read_only=on"
    assert result.tracking_table_exists is exists
    assert result.applied_revisions == (["0001_baseline"] if exists else [])
    connection.__aexit__.assert_awaited_once()
