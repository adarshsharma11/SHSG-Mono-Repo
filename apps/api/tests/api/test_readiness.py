from unittest.mock import AsyncMock

import httpx
import psycopg
import pytest

from shsg_api.services import health


async def test_ready_when_database_is_available(
    client: httpx.AsyncClient, monkeypatch: pytest.MonkeyPatch
) -> None:
    probe = AsyncMock(return_value=True)
    monkeypatch.setattr(health, "check_database", probe)
    response = await client.get("/ready")
    assert response.status_code == 200
    assert response.json() == {"status": "ready", "database": "ok"}
    probe.assert_awaited_once()


async def test_not_ready_when_database_probe_fails(
    client: httpx.AsyncClient, monkeypatch: pytest.MonkeyPatch
) -> None:
    monkeypatch.setattr(health, "check_database", AsyncMock(return_value=False))
    response = await client.get("/ready")
    assert response.status_code == 503
    assert response.json() == {"status": "not_ready", "database": "unavailable"}


@pytest.mark.parametrize(
    "error", [psycopg.OperationalError("private connection detail"), TimeoutError(), OSError()]
)
async def test_connection_errors_are_reported_without_leaking_details(
    client: httpx.AsyncClient, monkeypatch: pytest.MonkeyPatch, error: Exception
) -> None:
    monkeypatch.setattr(health, "check_database", AsyncMock(side_effect=error))
    response = await client.get("/ready")
    assert response.status_code == 503
    assert response.json() == {"status": "not_ready", "database": "unavailable"}
    assert "private connection detail" not in response.text


async def test_liveness_does_not_depend_on_database(
    client: httpx.AsyncClient, monkeypatch: pytest.MonkeyPatch
) -> None:
    probe = AsyncMock(side_effect=psycopg.OperationalError("Database offline"))
    monkeypatch.setattr(health, "check_database", probe)
    response = await client.get("/health")
    assert response.status_code == 200
    probe.assert_not_awaited()
