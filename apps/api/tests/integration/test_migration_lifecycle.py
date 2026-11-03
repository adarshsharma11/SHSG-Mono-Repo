from pathlib import Path
from uuid import uuid4

from alembic import command
from alembic.config import Config
from alembic.script import ScriptDirectory
from sqlalchemy import create_engine, inspect, text

from shsg_api.core.database import database_url
from shsg_api.core.settings import Settings


def test_postgres_migration_tracking_and_repeated_upgrade() -> None:
    """Exercise real PostgreSQL in a temporary schema rolled back after the test."""
    schema = f"shsg_migration_test_{uuid4().hex}"
    engine = create_engine(database_url(Settings()))
    try:
        with engine.connect() as connection:
            transaction = connection.begin()
            try:
                # The identifier is generated locally from a fixed prefix and UUID hex.
                connection.exec_driver_sql(f'CREATE SCHEMA "{schema}"')
                connection.exec_driver_sql(f'SET LOCAL search_path TO "{schema}"')
                config = Config(str(Path(__file__).resolve().parents[2] / "alembic.ini"))
                config.attributes["connection"] = connection
                head = ScriptDirectory.from_config(config).get_current_head()
                assert head is not None
                command.upgrade(config, "head")
                command.upgrade(config, "head")
                assert "alembic_version" in inspect(connection).get_table_names(schema=schema)
                assert connection.execute(
                    text("SELECT version_num FROM alembic_version")
                ).all() == [(head,)]
                command.downgrade(config, "base")
                assert (
                    connection.execute(text("SELECT version_num FROM alembic_version")).all() == []
                )
            finally:
                transaction.rollback()
    finally:
        engine.dispose()
