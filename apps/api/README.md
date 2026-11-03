# SHSG API

FastAPI backend at http://localhost:8000. The website uses port 9001 and the operations app uses port 9002. See the [root README](../../README.md) for workspace setup, Docker lifecycle, environment variables, database access, and troubleshooting.

## API and PostgreSQL together

With Docker and Compose v2 installed and running, execute from the repository root:

```bash
docker compose up --build -d
```

PostgreSQL starts first, initializes the local `shsg` database/login, and persists data in `postgres_data`. The `migrate` service then runs `alembic upgrade head`; FastAPI starts after it exits successfully. Revision `0002_create_users` creates persistent accounts. Local credentials default to `shsg` / `shsg_local_password`; optional overrides are in root `.env.example`. After the first build, `docker compose up -d` uses the built images; rebuild after source or revision changes.

```bash
docker compose ps
curl http://localhost:8000/health
curl http://localhost:8000/ready
```

The image installs locked dependencies with uv, runs as a non-root user, and checks `/ready` for container health. Host ports bind to loopback. Interactive API docs are at `/docs`.

## Host API development

Install Python 3.12+ and uv. Keep PostgreSQL in Docker and run FastAPI with reload:

```bash
docker compose up -d postgres
pnpm --filter @shsg/api db:migrate
pnpm dev:api
```

If the API container is already using port 8000, stop it first with `docker compose stop api`. The Next apps run on the host.

Copy `apps/api/.env.example` to `apps/api/.env` for optional overrides. The pnpm API script runs in `apps/api`, where `.env` is loaded. Environment variables use the `SHSG_` prefix and override dotenv values. The container API connects to `postgres:5432`; host API defaults to `127.0.0.1:5432`. Credentials are separate driver parameters, and the password uses Pydantic SecretStr. Restart after changing settings, which are cached per process.

CORS accepts comma-separated origins, defaulting to `http://localhost:9001,http://localhost:9002`. The middleware allows GET and POST.

## Endpoints

| Endpoint                     | Behavior                                                                                                                     |
| ---------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `GET /health`                | HTTP 200 `{"status":"ok"}`, no database dependency                                                                           |
| `GET /ready`                 | Runs `SELECT 1`; HTTP 200 `{"status":"ready","database":"ok"}` or HTTP 503 `{"status":"not_ready","database":"unavailable"}` |
| `GET /services`              | Existing static service catalog                                                                                              |
| `GET /services/{service_id}` | Existing static service details, or 404                                                                                      |
| `POST /auth/signup`          | Creates a user from `full_name`, `email`, `phone`, and an 8–128 character password                                           |
| `POST /auth/login`           | Returns an HS256 bearer token after email/password verification                                                              |

Readiness opens a short-lived asynchronous Psycopg connection with an overall deadline (`SHSG_DATABASE_TIMEOUT_SECONDS`, default 3 seconds). Private driver errors are not exposed. SQLAlchemy supplies the async session pool and metadata; Alembic manages schema revisions. Passwords use Argon2 and are never returned. The frontend mock-auth flow has not yet been connected to these endpoints.

## Structure

`main.py` configures the app, middleware, and lifespan. `api/router.py` registers `api/routes/health.py`, `services.py`, and the reserved `bookings.py` router, plus gated development diagnostics. Route handlers perform HTTP/controller work and call functions in `services/`. Pydantic contracts live in `schemas/`; database query modules will go in `repositories/`. SQLAlchemy models belong in `models/` and must be imported in `models/__init__.py` for migration discovery.

## Migrations

Revisions live in `migrations/versions/`; `migrations/env.py` loads shared settings/metadata, and `alembic.ini` configures discovery and logging. The Docker image includes these files. Startup applies committed revisions rather than generating files dynamically.

```bash
# Repository root; uses the built Docker image and configured PostgreSQL service:
docker compose logs migrate
docker compose run --rm migrate alembic current
docker compose run --rm migrate
```

Host aliases are `pnpm --filter @shsg/api db:migrate`, `db:current`, `db:history`, and `db:revision -m "description"`. See the [migration README](migrations/README.md) for autogeneration, review, rollback, and testing instructions. A successful one-shot migration container exits with code 0. Migration failures block a new API startup.

## Tests and checks

From the repository root:

```bash
uv sync --project apps/api --frozen
pnpm --filter @shsg/api test
pnpm --filter @shsg/api lint
pnpm --filter @shsg/api typecheck
```

The default suite stays in-process, excludes integration tests, and does not start Uvicorn or Docker. It covers authentication, response envelopes, services, CORS, liveness/readiness, deadlines, connection cleanup, dotenv, and credential masking.

With the configured PostgreSQL database already running:

```bash
cd apps/api
uv run pytest -m integration
```

Files under `tests/integration` are automatically marked by `tests/conftest.py`. The connectivity test performs a read-only query; the migration test exercises version tracking/repeated upgrades in a temporary schema inside a rolled-back transaction. Tests fail if the configured database is unavailable. Match host settings to initialized credentials and published ports. Default migration tests use SQLite only to verify the portable baseline and cannot validate future PostgreSQL-specific DDL.

## Persistence

`docker compose down` stops/removes containers while keeping the named volume. Changing `POSTGRES_DB`, `POSTGRES_USER`, or `POSTGRES_PASSWORD` does not reinitialize existing data or change existing role passwords. See the root README for normal shutdown and the separately labelled destructive reset.

## CI

The root [GitHub Actions workflow](../../.github/workflows/ci.yml) runs Python lint, formatting, type checks, and unit tests, then applies migrations to a fresh PostgreSQL 17 service, repeats the upgrade, verifies all heads are applied, checks model/migration drift, and runs integration tests. A separate Compose job builds the actual image and verifies startup order, HTTP readiness, image-packaged migrations, and persistent storage. All databases are disposable and use CI-only credentials. See the [root CI documentation](../../README.md#continuous-integration) for triggers and the aggregate required check.

## Local migration diagnostics

`GET /internal/migrations` is a read-only development endpoint, hidden from OpenAPI. It returns `tracking_table_exists` and `applied_revisions` only when `SHSG_ENVIRONMENT=local` and `SHSG_ENABLE_DEV_DIAGNOSTICS=true`; otherwise GET returns 404. Production blocks it even when enabled. Database errors become a sanitized 503.

The route delegates to `services/migrations.py` and `repositories/migrations.py`. The repository queries `public.alembic_version` using a database-enforced read-only connection with the existing deadline. Missing tracking tables return false/empty; no migration or table is created through HTTP. Enable the matching frontend flag to see this request on either development `/api` explorer. See the [client setup](../../packages/api-client/README.md).
