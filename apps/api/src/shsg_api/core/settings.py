from typing import Annotated, Literal

from pydantic import Field, SecretStr, field_validator, model_validator
from pydantic_settings import BaseSettings, NoDecode, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_prefix="SHSG_", env_file=".env", env_file_encoding="utf-8", extra="ignore"
    )

    app_name: str = "SHSG API"
    environment: Literal["local", "test", "production"] = "local"
    cors_origins: Annotated[list[str], NoDecode] = [
        "http://localhost:9001",
        "http://localhost:9002",
    ]
    log_level: str = "INFO"
    enable_dev_diagnostics: bool = False
    database_host: str = "127.0.0.1"
    database_port: int = Field(default=5432, ge=1, le=65535)
    database_name: str = "shsg"
    database_user: str = "shsg"
    database_password: SecretStr = SecretStr("shsg_local_password")
    database_timeout_seconds: float = Field(default=3, gt=0, le=30)
    auth_jwt_secret: SecretStr = SecretStr(
        "local-development-only-change-this-before-production-2026"
    )
    auth_access_token_minutes: int = Field(default=60, ge=5, le=1440)

    @field_validator("cors_origins", mode="before")
    @classmethod
    def split_cors_origins(cls, value: object) -> object:
        if isinstance(value, str):
            return [item.strip() for item in value.split(",") if item.strip()]
        return value

    @field_validator("auth_jwt_secret")
    @classmethod
    def require_strong_auth_secret(cls, value: SecretStr) -> SecretStr:
        if len(value.get_secret_value()) < 32:
            raise ValueError("SHSG_AUTH_JWT_SECRET must contain at least 32 characters")
        return value

    @model_validator(mode="after")
    def reject_local_auth_secret_in_production(self) -> "Settings":
        if (
            self.environment == "production"
            and self.auth_jwt_secret.get_secret_value()
            == "local-development-only-change-this-before-production-2026"
        ):
            raise ValueError("SHSG_AUTH_JWT_SECRET must be changed in production")
        return self
