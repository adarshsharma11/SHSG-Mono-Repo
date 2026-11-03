# Database migrations

Alembic runs the committed Python revisions in `versions/`, using shared SQLAlchemy metadata from `shsg_api.models.Base`. Connections use the existing `SHSG_DATABASE_*` settings; credentials are not stored in `alembic.ini`.

## Automatic Docker startup

From the repository root, build updated images and start:

```bash
docker compose up --build -d
```

Once images are built, `docker compose up -d` uses those images. Startup order is PostgreSQL healthy → `migrate` runs `alembic upgrade head` → migration service exits successfully → API starts. A failed migration blocks a new API container from starting. An existing running API is not paused by a separate migration run; this is a local startup workflow, not a coordinated production rollout.

The committed `0001_baseline` revision establishes tracking, and `0002_create_users` creates the authentication table and uniqueness constraints. Alembic records the latest applied revision in `alembic_version`. Repeating `upgrade head` at the latest revision performs no additional schema changes. The one-shot `migrate` container exiting with code 0 is expected.

Startup applies migrations; it does not autogenerate new revision files. After adding or editing migration files, rebuild images so the migration service receives the updated files. `docker compose restart api` does not run dependency migrations.

## Inspect or apply migrations

From the repository root:

```bash
docker compose logs migrate
docker compose run --rm migrate alembic current
docker compose run --rm migrate alembic history
docker compose run --rm migrate
```

The final command runs the migration service's default upgrade command. These commands use the database configured in Compose. To inspect the recorded revision directly:

```bash
docker compose exec postgres sh -c 'psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" -c "SELECT version_num FROM alembic_version;"'
```

For host development with PostgreSQL already running, use commands from `apps/api`:

```bash
uv run alembic current
uv run alembic history
uv run alembic upgrade head
```

Root workspace aliases: `pnpm --filter @shsg/api db:migrate`, `db:current`, and `db:history`. `history` and `heads` can inspect the revision files without a database; `current` and `upgrade` connect to it.

## Create the next revision

1. Define SQLAlchemy table models in `src/shsg_api/models/`, inheriting from `Base`.
2. Import each model in `models/__init__.py` so Alembic can discover its metadata.
3. Apply existing revisions to the development database.
4. Generate and review the next revision:

   ```bash
   cd apps/api
   uv run alembic upgrade head
   uv run alembic revision --autogenerate -m "create services table"
   ```

5. Inspect both `upgrade()` and `downgrade()` in the generated file. Autogeneration requires a database and is a starting point for review, especially for renames and data changes.
6. Apply, check, and commit the model plus revision:

   ```bash
   uv run alembic upgrade head
   uv run alembic current
   uv run alembic check
   ```

Use `uv run alembic revision -m "describe data change"` for a handwritten migration. The `db:revision` workspace alias generates an autogeneration candidate and accepts `-m "description"`. Rebuild Docker images after committing new migrations. Keep applied revisions immutable; add successor revisions to evolve the schema.

`alembic upgrade head --sql` previews upgrade SQL without opening a database connection. It cannot inspect an existing database or replace a real upgrade test.

## Rollback and tests

For a disposable development database, a reviewed `uv run alembic downgrade -1` reverts one revision. Future downgrades may delete data; understand the revision before running one. The baseline downgrade clears its version record; Alembic may retain an empty tracking table.

```bash
uv run pytest -m 'not integration'
uv run pytest -m integration
```

Default tests verify revision discovery, PostgreSQL offline SQL, template generation, password handling, and the portable baseline lifecycle using SQLite. They do not prove PostgreSQL-specific DDL compatibility. Integration tests require the configured PostgreSQL database; the migration lifecycle test creates a uniquely named schema inside a transaction and rolls it back afterward. Existing public/application tables are not downgraded by that test.

The current head is `0002_create_users`. Downgrading it drops the `users` table and permanently deletes account records, so only do that intentionally.
