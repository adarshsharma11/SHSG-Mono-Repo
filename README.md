# Southern Home Services Group (SHSG)

SHSG is a pnpm/Turbo monorepo with a public website, an operations app, a FastAPI backend, and a shared React component library.

The copied `apps/public-website` project is reference material. It is excluded from the pnpm workspace, repository formatting, and SHSG CI; its original source and dependencies are left intact.

## Repository and local URLs

| Path                  | Purpose                                                   | Local URL                    |
| --------------------- | --------------------------------------------------------- | ---------------------------- |
| `apps/website`        | Public Next.js website and UI showcases                   | http://localhost:9001        |
| `apps/app`            | Next.js operations application                            | http://localhost:9002        |
| `apps/api`            | FastAPI backend                                           | http://localhost:8000        |
| `packages/ui`         | Shared React/TypeScript components and Tailwind v4 tokens | Consumed by both Next apps   |
| `packages/api-client` | Shared typed API transport and proxy logic                | Used by both Next apps       |
| `docker-compose.yml`  | Local API and PostgreSQL services                         | PostgreSQL: `127.0.0.1:5432` |

Most UI showcases use local demo state. Both frontends now have a development API explorer with real backend requests. The service catalog remains static; there are no customer, booking, or invoice tables yet.

## Quick start: API and database in one command

Install and start [Docker Desktop](https://docs.docker.com/get-started/get-docker/), or Docker Engine with Compose v2. From the repository root:

```bash
docker compose up --build -d
```

This builds the API and migration images, starts PostgreSQL, creates the `shsg` database/login on first initialization, and applies committed migrations before starting FastAPI. The baseline creates Alembic's `alembic_version` tracking table. No environment-file copy or manual SQL is required for the defaults. The first run downloads images and dependencies. After images are built, `docker compose up -d` starts the stack using those images; rebuild after adding code or migrations.

```bash
docker compose ps
curl http://localhost:8000/health
curl http://localhost:8000/ready
curl http://localhost:8000/services
```

For startup that also waits until all services report healthy, use `docker compose up --build -d --wait`. Interactive API docs are at http://localhost:8000/docs.

| Endpoint                 | Expected behavior                                                                                                            |
| ------------------------ | ---------------------------------------------------------------------------------------------------------------------------- |
| `/health`                | HTTP 200 `{"status":"ok"}` when the API responds; independent of PostgreSQL                                                  |
| `/ready`                 | Runs `SELECT 1`; HTTP 200 `{"status":"ready","database":"ok"}` or HTTP 503 `{"status":"not_ready","database":"unavailable"}` |
| `/services`              | Existing static service catalog                                                                                              |
| `/services/{service_id}` | Existing static service detail, or 404                                                                                       |

Startup order is PostgreSQL healthy → `migrate` completes successfully → API starts. A migration failure blocks new API startup; a migration container with exit code 0 is expected. The API container health check uses `/ready`. Compose dependency conditions apply at startup and do not coordinate an already-running API with a later manual migration or automatically restart unhealthy services. Readiness recovers when PostgreSQL is available again.

This Compose configuration is for local development. API/database host ports bind to loopback. Example credentials are local defaults; the bootstrap `shsg` login has database administrator privileges. Use separate deployment configuration and credentials for hosted environments.

## Run the frontends

Prerequisites: Node.js 22 and pnpm matching `package.json` (`12.15.0`). Install [uv](https://docs.astral.sh/uv/getting-started/installation/) and Python 3.12+ for host API development or tests. Docker builds use Python 3.12.

Install workspace dependencies from the root:

```bash
pnpm install --frozen-lockfile
```

In separate terminals, run:

```bash
pnpm dev:website
```

```bash
pnpm dev:app
```

The Next apps run on the host while API/PostgreSQL run in Docker. CORS defaults allow `http://localhost:9001` and `http://localhost:9002`. Another hostname/port needs an explicit CORS entry. The API explorers use same-origin Next handlers to call FastAPI from the server. Other component demos remain local examples.

## Frontend API clients and explorers

Visit http://localhost:9001/api or http://localhost:9002/api with the corresponding Next dev server running. The explorer runs health, readiness, service-list, and service-detail requests on demand. It displays safe errors and status codes. Readiness reports 503 while PostgreSQL is unavailable; the static catalog can still work. The explorer page returns 404 in production.

Each frontend owns its API client and resource modules: `apps/website/api` and `apps/app/src/api`. Both inject configured Axios instances into their resources. The shared `@shsg/api-client` workspace provides HTTP configuration, typed response handling, safe errors, environment helpers, and proxy handling. Private configuration stays in server-only modules. Copy `apps/website/.env.example` to `apps/website/.env.local` and `apps/app/.env.example` to `apps/app/.env.local` for overrides:

```dotenv
SHSG_API_BASE_URL=http://127.0.0.1:8000
SHSG_API_TIMEOUT_MS=5000
SHSG_ENABLE_DEV_DIAGNOSTICS=false
```

No public environment variable or legacy CRM credential is needed. Browser calls use `/api/health`, `/api/ready`, `/api/services`, and `/api/services/[serviceId]`. Those handlers remain available in production and perform explicit allowlisted backend calls at request time, with no-store responses. Frontend builds do not need a running backend.

Optional migration diagnostics require `SHSG_ENABLE_DEV_DIAGNOSTICS=true` in frontend `.env.local` files and either root `.env` for Docker or `apps/api/.env` for a host API. Restart relevant processes. The backend additionally requires `SHSG_ENVIRONMENT=local`. Both layers block diagnostics in production. `/api/internal/migrations` reports tracking-table presence and applied revisions using read-only queries, without running migrations. Full setup: [API-client README](packages/api-client/README.md).

## Run FastAPI on the host instead

```bash
docker compose up -d postgres
pnpm --filter @shsg/api db:migrate
pnpm dev:api
```

If the API container is already using port 8000, stop it first with `docker compose stop api`. The pnpm command runs Uvicorn with reload in `apps/api`, where uv creates/syncs its Python environment.

Optional host API overrides:

```bash
cp apps/api/.env.example apps/api/.env
```

API settings load `.env` from the process working directory. Process environment variables override file values. The pnpm API commands use `apps/api` as their working directory. Restart after changing settings, which are cached per process.

## Environment settings

The root `.env` controls Docker Compose. `apps/api/.env` controls a host-run API. Both are optional and ignored by Git; `.env.example` files document defaults.

### Docker Compose overrides

```bash
cp .env.example .env
```

| Variable            | Default                                       | Purpose                                  |
| ------------------- | --------------------------------------------- | ---------------------------------------- |
| `POSTGRES_DB`       | `shsg`                                        | Database created on first initialization |
| `POSTGRES_USER`     | `shsg`                                        | Local PostgreSQL bootstrap login         |
| `POSTGRES_PASSWORD` | `shsg_local_password`                         | Local login password                     |
| `POSTGRES_PORT`     | `5432`                                        | Published database port on the host      |
| `API_PORT`          | `8000`                                        | Published API port on the host           |
| `SHSG_CORS_ORIGINS` | `http://localhost:9001,http://localhost:9002` | Comma-separated frontend origins         |

The container API connects to `postgres:5432` over the Compose network. Changing published host ports does not change internal addresses. Credentials are passed as separate driver parameters; the API does not construct a password-containing URL.

For a port conflict, set `POSTGRES_PORT=5433` in root `.env`. A host API must then set `SHSG_DATABASE_PORT=5433` in `apps/api/.env`; the container API still uses 5432. Likewise, `API_PORT=8001` publishes the API at localhost:8001.

Initialization settings apply only to an empty PostgreSQL data directory. Changing database/user/password variables does not rename databases or update credentials in an existing volume. Update existing roles through SQL or use the explicitly destructive reset below for disposable local data. The [official PostgreSQL image documentation](https://github.com/docker-library/docs/blob/master/postgres/README.md) explains initialization and persistence. This setup uses PostgreSQL 17 and `/var/lib/postgresql/data`; major-version upgrades require a data migration plan.

### Host API settings

| Variable                        | Default                                       |
| ------------------------------- | --------------------------------------------- |
| `SHSG_ENVIRONMENT`              | `local`                                       |
| `SHSG_LOG_LEVEL`                | `INFO`                                        |
| `SHSG_CORS_ORIGINS`             | `http://localhost:9001,http://localhost:9002` |
| `SHSG_DATABASE_HOST`            | `127.0.0.1`                                   |
| `SHSG_DATABASE_PORT`            | `5432`                                        |
| `SHSG_DATABASE_NAME`            | `shsg`                                        |
| `SHSG_DATABASE_USER`            | `shsg`                                        |
| `SHSG_DATABASE_PASSWORD`        | `shsg_local_password`                         |
| `SHSG_DATABASE_TIMEOUT_SECONDS` | `3`                                           |

Match host settings to initialized database credentials. Readiness uses a short-lived asynchronous Psycopg connection with an overall deadline. Password settings are masked; raw driver errors are not returned by `/ready`. SQLAlchemy supplies the model metadata registry and Alembic handles migrations. There is no business schema or application connection pool yet; the static catalog remains unchanged.

## Database access and lifecycle

Open psql with the container's configured database and user:

```bash
docker compose exec postgres sh -c 'psql -U "$POSTGRES_USER" -d "$POSTGRES_DB"'
```

Useful read-only SQL:

```sql
SELECT current_database(), current_user, version();
SELECT 1;
```

Use `\dt` to list tables and `\q` to exit. After the migration service succeeds, `alembic_version` records `0001_baseline`; there are no business tables yet. Desktop clients can connect through `127.0.0.1`, the published database port, and the credentials above.

```bash
docker compose logs -f api postgres
docker compose restart api
docker compose down
```

Normal restart, rebuild, and `docker compose down` preserve data in the named `postgres_data` volume. Compose prefixes its actual name with the project name; use the same checkout/project name to reuse it.

**Destructive reset — deletes this Compose project's local database data:**

```bash
docker compose down --volumes
docker compose up --build -d
```

Do not reset when you need the data. New initialization credentials take effect on the next empty volume.

## Shared UI library

Import from `@shsg/ui` or its component subpaths. Both Next apps already depend on this workspace package. They import `@shsg/ui/styles.css` and scan its source using Tailwind v4. Shared theme tokens live in `packages/ui/src/styles.css`.

| Component family                      | Website route     |
| ------------------------------------- | ----------------- |
| Button                                | `/button`         |
| Inputs and React Hook Form validation | `/input`          |
| Typography                            | `/typography`     |
| Modal                                 | `/modal`          |
| Badge                                 | `/badge`          |
| Alert                                 | `/alert`          |
| Spinner / Skeleton                    | `/loading-states` |
| Card / Section                        | `/card`           |
| Tabs                                  | `/tabs`           |
| Dropdown Menu                         | `/dropdown-menu`  |
| Tooltip                               | `/tooltip`        |
| Accordion                             | `/accordion`      |
| Table / Pagination                    | `/table`          |
| Empty State                           | `/empty-state`    |

Visit these routes under http://localhost:9001. See [the UI README](packages/ui/README.md) for props, examples, keyboard behavior, reduced motion, and limitations. Interactive components require a client boundary; native/static components can render on the server. Demo forms, settings, and tables use local state and do not persist business data.

## Tests and quality checks

Install Python development dependencies:

```bash
uv sync --project apps/api --frozen
```

From the repository root:

```bash
pnpm test
pnpm lint
pnpm typecheck
pnpm build
pnpm format:check
```

Turbo runs the workspace scripts. UI tests include component behavior and interactive website examples. Default API tests run in-process and exclude external-database integration tests. Build covers the Next apps; Docker Compose builds the API image.

Targeted checks:

```bash
pnpm --filter @shsg/ui test
pnpm --filter @shsg/api-client test
pnpm --filter @shsg/api test
pnpm --filter @shsg/api lint
pnpm --filter @shsg/api typecheck
pnpm --filter @shsg/website typecheck
```

With PostgreSQL already running, verify real connectivity using host API database settings:

```bash
cd apps/api
uv run pytest -m integration
```

Integration tests do not start Docker. The connectivity probe performs `SELECT 1`; the migration test uses a temporary schema within a transaction and rolls it back. Default API tests verify endpoints, configuration, and the portable migration lifecycle without PostgreSQL.

## API structure and migration commands

```text
apps/api/
├── alembic.ini
├── migrations/
│   ├── env.py
│   ├── script.py.mako
│   └── versions/0001_baseline.py
└── src/shsg_api/
    ├── main.py
    ├── api/
    │   ├── router.py
    │   └── routes/{health,services,bookings,diagnostics}.py
    ├── services/
    ├── repositories/
    ├── schemas/
    ├── models/
    └── core/
```

Route handlers own HTTP behavior, services own application logic, schemas define request/response contracts, and models register SQLAlchemy metadata. Repositories are reserved for future database queries. The bookings router is a placeholder until its schema and endpoints are defined. Existing HTTP paths remain unchanged.

Inspect/apply migrations using the Docker image:

```bash
docker compose logs migrate
docker compose run --rm migrate alembic current
docker compose run --rm migrate alembic history
docker compose run --rm migrate
```

For host development, use `pnpm --filter @shsg/api db:migrate`, `db:current`, or `db:history`. To create a new migration, define/import the SQLAlchemy models and run from `apps/api`:

```bash
uv run alembic upgrade head
uv run alembic revision --autogenerate -m "describe schema change"
# Review the generated upgrade/downgrade operations before applying.
uv run alembic upgrade head
```

Startup applies committed migration files; it does not generate new ones. Full instructions and test limitations are in the [migration README](apps/api/migrations/README.md).

## Continuous integration

[`.github/workflows/ci.yml`](.github/workflows/ci.yml) runs on pushes, pull requests, and manual dispatch from GitHub Actions. Jobs run on Ubuntu 24.04 with read-only repository permissions. Newer runs on the same ref cancel older runs. No deployment or repository write is performed, and no repository secrets are required; database credentials are disposable CI-only values.

| Check              | Coverage                                                                                                                                                                                                       |
| ------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Frontend           | Frozen pnpm install; repository Prettier check; API-client/UI/website/app ESLint and TypeScript checks; client and UI/website interaction tests; production builds of both Next apps                           |
| API and PostgreSQL | Python lint/format/type checks; unit/API tests; fresh PostgreSQL 17 migration upgrade; repeat upgrade; current-head verification; `alembic check` for missing migrations; PostgreSQL integration tests         |
| Docker Compose     | Configuration validation; actual API/migration image build; database → migration → API startup; HTTP liveness/readiness; migrations checked inside the image; database persistence across container recreation |
| Required checks    | Passes only when all three jobs succeed; failed, skipped, or cancelled dependencies do not count as success                                                                                                    |

Frontend CI uses Node 22 and the pnpm version in root `package.json`. It runs `next typegen` for each Next app before standalone TypeScript checks so clean checkouts have their generated route types. Both production builds remain blocking checks; they are not skipped when a local sandbox prevents an internal Turbopack socket.

API CI uses uv 0.13.6, Python 3.12, and the locked dependencies. Its PostgreSQL service is fresh for each job. The migration lifecycle integration test checks against the current committed head, so future revisions do not require hardcoding a new expected version. The dotenv unit test isolates its file-fallback field from the CI database environment.

The Compose job uses a unique project name per run/attempt. After migration drift checks, it writes a temporary persistence probe, recreates containers without deleting the volume, and verifies the probe survives. It prints service state/logs on failure and removes that job's containers and volumes during cleanup. The probe is confined to the disposable CI database.

After the first successful run, select **Required checks** as a required status check in GitHub branch protection or a ruleset if merges should be blocked on CI. This workflow does not configure branch protection automatically. Pushing/committing this file is necessary to trigger a hosted run; local validation alone does not establish a green GitHub check.

## Troubleshooting

- **Docker missing/daemon unavailable:** install/start Docker Desktop or Docker Engine with Compose v2; check `docker version` and `docker compose version`.
- **Migration service fails or API waits for it:** inspect `docker compose logs migrate`, confirm database credentials, and rebuild images after adding revisions. Fix the migration and rerun `docker compose up --build -d`. An empty/unavailable `alembic_version` can be inspected with the migration commands above.
- **Port already allocated:** stop the conflicting process or change `POSTGRES_PORT`/`API_PORT`, then update host client settings.
- **`/health` is 200 but `/ready` is 503:** check database logs and initialized credentials. Container API uses host `postgres`; host API uses `127.0.0.1`. Private driver errors are intentionally omitted from readiness responses.
- **Changed password but authentication still fails:** environment edits do not update existing volume credentials. Restore the correct settings or update the database role explicitly.
- **Frontend CORS errors:** use the documented localhost ports, or update `SHSG_CORS_ORIGINS` and recreate the API with `docker compose up -d api`.
- **Tailwind loader missing after an install:** stop the affected Next dev server, move its generated `.next/dev` directory aside, then restart. Install dependencies from the workspace root without running dev servers during relinking.
- **Turbopack build says `binding to a port: Operation not permitted`:** run the build in an environment that permits internal worker sockets. Successful dev HTTP/type checks do not replace a production build.
- **Shared styles missing:** check the app's import of `@shsg/ui/styles.css` and Tailwind source scanning.

## Next milestones

Agree on customer, property, service, booking, and invoice models, then add successor migrations, repositories, and database-backed endpoints. Connect the Next apps after those contracts are defined. Authentication, authorization, production deployment, and production database operations are separate work from this local foundation.

Further detail: [API README](apps/api/README.md), [UI README](packages/ui/README.md).

## SHSG homepage and delivery plan

The customer website homepage is at http://localhost:9001. It introduces Southern Home Handyman and Boxwood and includes a local project brief planner. See the [website README](apps/website/README.md) for page structure, images, and testing, and the [SHSG implementation plan](docs/SHSG_PLAN.md) for the phased operating-platform roadmap. Shared UI examples are available at `/components`.

## Lint rules and Git hooks

Each frontend uses its own ESLint flat config with Next.js presets and an explicit rules object. Run `pnpm lint` from the root to check all workspace packages. Errors block checks; rules configured as warnings remain advisory. Type-only imports may be separate from runtime imports without triggering duplicate-import errors.

Husky runs the discoverable `lint-staged.config.mjs` on pre-commit. Staged frontend source/config files are checked with the ESLint executable from their own app; staged JSON, documentation, styles, and YAML are checked with Prettier. Pre-push runs workspace lint, type checks, and tests. Warning-only lint findings do not block either hook. Run `pnpm install` after cloning to install dependencies and prepare Husky.
