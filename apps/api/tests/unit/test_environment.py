from pathlib import Path

import pytest
from pydantic import ValidationError

from shsg_api.core.settings import Settings


def test_csv_cors_origins_work_from_real_environment(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setenv("SHSG_CORS_ORIGINS", "http://localhost:9001, http://localhost:9002")
    assert Settings().cors_origins == ["http://localhost:9001", "http://localhost:9002"]


def test_dotenv_is_loaded_and_environment_overrides_it(
    tmp_path: Path, monkeypatch: pytest.MonkeyPatch
) -> None:
    monkeypatch.chdir(tmp_path)
    # CI supplies database credentials; this test specifically exercises the dotenv fallback.
    monkeypatch.delenv("SHSG_DATABASE_NAME", raising=False)
    (tmp_path / ".env").write_text(
        "SHSG_DATABASE_HOST=from-file\nSHSG_DATABASE_NAME=from_file_database\n"
        "SHSG_CORS_ORIGINS=http://localhost:9001,http://localhost:9002\n"
    )
    monkeypatch.setenv("SHSG_DATABASE_HOST", "from-environment")
    settings = Settings()
    assert settings.database_host == "from-environment"
    assert settings.database_name == "from_file_database"
    assert settings.cors_origins == ["http://localhost:9001", "http://localhost:9002"]


def test_password_is_masked_in_settings_representation() -> None:
    settings = Settings(database_password="private-password")
    assert "private-password" not in repr(settings)
    assert settings.database_password.get_secret_value() == "private-password"


@pytest.mark.parametrize("port", [0, 65536])
def test_invalid_database_ports_are_rejected(port: int) -> None:
    with pytest.raises(ValidationError):
        Settings(database_port=port)
