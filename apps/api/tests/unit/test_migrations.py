import ast
import io
import shutil
from pathlib import Path

from alembic import command
from alembic.config import Config
from alembic.script import ScriptDirectory
from sqlalchemy import create_engine, inspect, text

from shsg_api.core.database import database_url
from shsg_api.core.settings import Settings
from shsg_api.models import Base

API_ROOT = Path(__file__).resolve().parents[2]


def migration_config() -> Config:
    return Config(str(API_ROOT / "alembic.ini"))


def test_baseline_has_one_head_and_shared_metadata_registry() -> None:
    scripts = ScriptDirectory.from_config(migration_config())
    assert len(scripts.get_heads()) == 1
    assert scripts.get_revision("0001_baseline") is not None
    assert Base.metadata.naming_convention["pk"] == "pk_%(table_name)s"


def test_postgres_offline_sql_creates_and_records_migration_tracking() -> None:
    output = io.StringIO()
    config = migration_config()
    config.output_buffer = output
    command.upgrade(config, "head", sql=True)
    sql = output.getvalue()
    assert "CREATE TABLE alembic_version" in sql
    assert "INSERT INTO alembic_version" in sql
    assert "0001_baseline" in sql
    assert "shsg_local_password" not in sql


def test_baseline_upgrade_is_repeatable_and_can_be_downgraded() -> None:
    # SQLite exercises the portable baseline without requiring a running PostgreSQL service.
    engine = create_engine("sqlite://")
    try:
        with engine.begin() as connection:
            config = migration_config()
            config.attributes["connection"] = connection
            command.upgrade(config, "0001_baseline")
            assert inspect(connection).get_table_names() == ["alembic_version"]
            command.upgrade(config, "0001_baseline")
            assert connection.execute(text("SELECT version_num FROM alembic_version")).all() == [
                ("0001_baseline",)
            ]
            command.downgrade(config, "base")
            assert connection.execute(text("SELECT version_num FROM alembic_version")).all() == []
            command.upgrade(config, "0001_baseline")
    finally:
        engine.dispose()


def test_revision_template_can_generate_a_valid_successor(tmp_path: Path) -> None:
    shutil.copytree(API_ROOT / "migrations", tmp_path / "migrations")
    config = migration_config()
    config.set_main_option("script_location", str(tmp_path / "migrations"))
    command.revision(config, message="Example next revision", rev_id="0002_template")
    generated = next((tmp_path / "migrations" / "versions").glob("0002_template_*.py"))
    ast.parse(generated.read_text())
    assert ScriptDirectory.from_config(config).get_current_head() == "0002_template"


def test_url_preserves_password_characters_without_config_interpolation() -> None:
    password = "p@ss:/% word's"
    url = database_url(Settings(database_password=password))
    assert url.drivername == "postgresql+psycopg"
    assert url.password == password
    assert password not in url.render_as_string(hide_password=True)
