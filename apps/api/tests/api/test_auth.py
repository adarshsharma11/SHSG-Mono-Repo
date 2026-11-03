from collections.abc import AsyncIterator
from datetime import UTC, datetime
from types import SimpleNamespace
from unittest.mock import AsyncMock
from uuid import uuid4

import httpx
import pytest
from sqlalchemy.ext.asyncio import AsyncSession

from shsg_api.core.database import get_session
from shsg_api.main import create_app
from shsg_api.services.auth import SignupConflictError


def user_record() -> SimpleNamespace:
    return SimpleNamespace(
        id=uuid4(),
        full_name="Ada Lovelace",
        email="ada@example.com",
        phone="+15551234567",
        password_hash="not-returned",
        is_active=True,
        created_at=datetime.now(UTC),
    )


async def auth_client() -> tuple[httpx.AsyncClient, AsyncMock]:
    app = create_app()
    session = AsyncMock(spec=AsyncSession)

    async def override_session() -> AsyncIterator[AsyncSession]:
        yield session

    app.dependency_overrides[get_session] = override_session
    transport = httpx.ASGITransport(app=app)
    return httpx.AsyncClient(transport=transport, base_url="http://testserver"), session


async def test_signup_returns_created_user(monkeypatch: pytest.MonkeyPatch) -> None:
    user = user_record()
    signup = AsyncMock(return_value=user)
    monkeypatch.setattr("shsg_api.api.routes.auth.signup_user", signup)
    client, _session = await auth_client()

    async with client:
        response = await client.post(
            "/auth/signup",
            json={
                "full_name": "Ada Lovelace",
                "email": "ada@example.com",
                "phone": "+15551234567",
                "password": "correct-horse-battery-staple",
            },
        )

    assert response.status_code == 201
    assert response.json()["success"] is True
    assert response.json()["data"]["email"] == "ada@example.com"
    assert "password_hash" not in response.text


async def test_signup_conflict_uses_real_http_status(
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    signup = AsyncMock(side_effect=SignupConflictError("Account already exists."))
    monkeypatch.setattr("shsg_api.api.routes.auth.signup_user", signup)
    client, _session = await auth_client()

    async with client:
        response = await client.post(
            "/auth/signup",
            json={
                "full_name": "Ada Lovelace",
                "email": "ada@example.com",
                "phone": "+15551234567",
                "password": "correct-horse-battery-staple",
            },
        )

    assert response.status_code == 409
    assert response.json()["success"] is False
    assert response.json()["error"]["code"] == "ACCOUNT_ALREADY_EXISTS"


async def test_login_returns_bearer_token(monkeypatch: pytest.MonkeyPatch) -> None:
    authenticate = AsyncMock(return_value=user_record())
    monkeypatch.setattr("shsg_api.api.routes.auth.authenticate_user", authenticate)
    client, _session = await auth_client()

    async with client:
        response = await client.post(
            "/auth/login",
            json={"email": "ada@example.com", "password": "correct-password"},
        )

    assert response.status_code == 200
    assert response.json()["data"]["token_type"] == "bearer"
    assert response.json()["data"]["expires_in"] == 3600


async def test_login_rejects_invalid_credentials(monkeypatch: pytest.MonkeyPatch) -> None:
    authenticate = AsyncMock(return_value=None)
    monkeypatch.setattr("shsg_api.api.routes.auth.authenticate_user", authenticate)
    client, _session = await auth_client()

    async with client:
        response = await client.post(
            "/auth/login",
            json={"email": "ada@example.com", "password": "incorrect"},
        )

    assert response.status_code == 401
    assert response.headers["www-authenticate"] == "Bearer"
    assert response.json()["error"]["code"] == "INVALID_CREDENTIALS"
