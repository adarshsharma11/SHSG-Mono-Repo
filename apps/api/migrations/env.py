import math
from logging.config import fileConfig

from alembic import context
from sqlalchemy import Connection, create_engine, pool

from shsg_api.core import get_settings
from shsg_api.core.database import database_url
from shsg_api.models import Base

config = context.config
if config.config_file_name is not None:
    fileConfig(config.config_file_name, disable_existing_loggers=False)

target_metadata = Base.metadata


def run_migrations_offline() -> None:
    context.configure(
        url=database_url(get_settings()),
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
        compare_type=True,
    )
    with context.begin_transaction():
        context.run_migrations()


def migrate_connection(connection: Connection) -> None:
    context.configure(connection=connection, target_metadata=target_metadata, compare_type=True)
    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    # Supports callers that own a transaction, including isolated migration tests.
    supplied_connection = config.attributes.get("connection")
    if isinstance(supplied_connection, Connection):
        migrate_connection(supplied_connection)
        return
    settings = get_settings()
    engine = create_engine(
        database_url(settings),
        poolclass=pool.NullPool,
        connect_args={"connect_timeout": max(2, math.ceil(settings.database_timeout_seconds))},
        hide_parameters=True,
    )
    try:
        with engine.connect() as connection:
            migrate_connection(connection)
    finally:
        engine.dispose()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
