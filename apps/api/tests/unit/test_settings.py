import pytest
from pydantic import ValidationError

from shsg_api.core.settings import Settings


def test_comma_separated_origins_become_a_list() -> None:
    settings = Settings.model_validate(
        {"cors_origins": "http://localhost:9001, http://localhost:9002"}
    )

    assert settings.cors_origins == [
        "http://localhost:9001",
        "http://localhost:9002",
    ]


def test_defaults_allow_both_next_apps() -> None:
    settings = Settings()

    assert settings.cors_origins == [
        "http://localhost:9001",
        "http://localhost:9002",
    ]
    assert settings.environment == "local"


def test_production_requires_a_non_default_auth_secret() -> None:
    with pytest.raises(ValidationError, match="SHSG_AUTH_JWT_SECRET"):
        Settings(environment="production")

    secret = "production-test-secret-at-least-32-characters"
    settings = Settings(environment="production", auth_jwt_secret=secret)
    assert settings.auth_jwt_secret.get_secret_value() == secret
