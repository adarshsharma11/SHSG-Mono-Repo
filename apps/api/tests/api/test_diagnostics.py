from unittest.mock import AsyncMock

import httpx
import psycopg
import pytest

from shsg_api.api.routes import diagnostics
from shsg_api.core import get_settings
from shsg_api.core.settings import Settings
from shsg_api.main import create_app
from shsg_api.schemas.migrations import MigrationStatus


@pytest.mark.parametrize(
    "environment,enabled", [("local", False), ("production", True), ("test", True)]
)
async def test_diagnostics_are_not_public(
    environment: str, enabled: bool, monkeypatch: pytest.MonkeyPatch
) -> None:
    app = create_app()
    settings = Settings.model_validate(
        {"environment": environment, "enable_dev_diagnostics": enabled}
    )
    app.dependency_overrides[get_settings] = lambda: settings
    probe = AsyncMock()
    monkeypatch.setattr(diagnostics, "get_migration_status", probe)
    async with httpx.AsyncClient(
        transport=httpx.ASGITransport(app=app), base_url="http://test"
    ) as client:
        assert (await client.get("/internal/migrations")).status_code == 404
        assert (await client.post("/internal/migrations")).status_code == 405
    probe.assert_not_awaited()


async def test_enabled_local_diagnostics_return_only_tracking_status(
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    app = create_app()
    app.dependency_overrides[get_settings] = lambda: Settings(enable_dev_diagnostics=True)
    monkeypatch.setattr(
        diagnostics,
        "get_migration_status",
        AsyncMock(
            return_value=MigrationStatus(
                tracking_table_exists=True, applied_revisions=["0001_baseline"]
            )
        ),
    )
    async with httpx.AsyncClient(
        transport=httpx.ASGITransport(app=app), base_url="http://test"
    ) as client:
        response = await client.get("/internal/migrations")
    assert response.json() == {
        "tracking_table_exists": True,
        "applied_revisions": ["0001_baseline"],
    }


async def test_diagnostics_errors_are_redacted(monkeypatch: pytest.MonkeyPatch) -> None:
    app = create_app()
    app.dependency_overrides[get_settings] = lambda: Settings(enable_dev_diagnostics=True)
    monkeypatch.setattr(
        diagnostics,
        "get_migration_status",
        AsyncMock(side_effect=psycopg.OperationalError("private password")),
    )
    async with httpx.AsyncClient(
        transport=httpx.ASGITransport(app=app), base_url="http://test"
    ) as client:
        response = await client.get("/internal/migrations")
    assert response.status_code == 503
    assert "private password" not in response.text
