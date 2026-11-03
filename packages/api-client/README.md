# @shsg/api-client

Shared Axios infrastructure for both SHSG frontends. Business resource modules belong to each application, allowing their API methods to evolve independently. No external CRM credentials or integrations are copied from the reference project.

```tsx
import { createApiClient } from '@/api';
import { ApiError } from '@shsg/api-client';

const client = createApiClient({ baseUrl: '/api' });
const services = await client.services.list();
const service = await client.services.get('hvac');
const health = await client.health.get();
const readiness = await client.health.readiness();
```

Server clients use an absolute HTTP(S) backend URL; browser clients use the same-origin `/api` prefix. All methods accept `{ signal }`. `timeoutMs` defaults to 5000 and accepts integers from 1 to 30000. For dependency injection, construct the app’s `ApiClient` with an `AxiosInstance`; tests can inject an instance with a controlled Axios adapter. Client construction sends no request. Browser and server timeouts are independent budgets; use a longer browser budget when a server request is allowed more time.

Resource methods use GET with JSON responses. Axios sends a no-store request header, and frontend proxy responses send Cache-Control: no-store. Server Axios instances reject redirects using maxRedirects: 0; browser redirects follow browser behavior. Resource methods use Axios response generics with shared TypeScript interfaces. Response JSON is trusted: there is no runtime schema validation or removal of extra success fields. FastAPI response models define the server contract; TypeScript does not verify received JSON. Service IDs accept 1–100 letters, numbers, hyphens, or underscores. Shared TypeScript contracts match current Pydantic schemas; they are not OpenAPI-generated yet.

Failures throw `ApiError`, with a safe message, numeric status, and code: `HTTP_ERROR`, `NETWORK_ERROR`, `TIMEOUT`, `CANCELLED`, or `INVALID_REQUEST`. Upstream error bodies and network exception messages are discarded, including the body of a readiness 503. The HTTP status is preserved with a generic safe message. Failures do not become successful empty arrays. `probeApi` converts an operation into `{ ok, status, data }` for the explorer. Normal application code can catch ApiError directly.

## Application ownership and injection

```text
apps/website/api/              apps/app/src/api/
├── ApiClient.ts               ├── ApiClient.ts
├── index.ts                   ├── index.ts
└── resources/                 └── resources/
    ├── Services.ts                ├── Services.ts
    ├── Health.ts                  ├── Health.ts
    └── Migrations.ts              └── Migrations.ts
```

Each resource is a factory receiving an Axios instance. The app’s ApiClient class composes those factories; its index.ts creates the configured instance. Browser consoles and server proxies import their own app’s client. Shared code has no knowledge of either app’s resource composition.

```ts
import { createHttpClient } from '@shsg/api-client';
import { ApiClient } from '@/api';

const http = createHttpClient({ baseUrl: '/api', timeoutMs: 5000 });
const client = new ApiClient(http);
```

## Server configuration

Each frontend owns `lib/env.server.ts` and `lib/api.server.ts`, under `src/` in the operations app. These import `server-only`, preventing accidental client imports. The shared config parser is pure: the app supplies an explicit environment allowlist.

| Setting                       | Default                 |
| ----------------------------- | ----------------------- |
| `SHSG_API_BASE_URL`           | `http://127.0.0.1:8000` |
| `SHSG_API_TIMEOUT_MS`         | `5000`                  |
| `SHSG_ENABLE_DEV_DIAGNOSTICS` | `false`                 |

The URL must be absolute HTTP(S) without embedded credentials, a query, or a fragment. Timeout and boolean flags are validated. These are server settings, without `NEXT_PUBLIC_`; neither the configuration object nor backend URL is passed to Client Components. The flat validated environment configuration uses Object.freeze to prevent accidental mutation. Client resource properties use TypeScript readonly. Freezing does not hide or encrypt values.

Shared `createApiProxy` receives the app-owned client factory and handles Web Request/Response behavior. Per-app wrappers await Next's `connection()` so backend calls happen at request time, not during builds. Routes allowlist individual operations rather than accepting arbitrary target URLs. They return no-store JSON and sanitized errors. Incoming cookies, bearer tokens, and arbitrary headers are not forwarded; authentication remains future work.

| Frontend GET route          | FastAPI GET route                                                 |
| --------------------------- | ----------------------------------------------------------------- |
| `/api/health`               | `/health`                                                         |
| `/api/ready`                | `/ready`                                                          |
| `/api/services`             | `/services`                                                       |
| `/api/services/[serviceId]` | `/services/{service_id}`                                          |
| `/api/internal/migrations`  | `/internal/migrations`, explicitly enabled local diagnostics only |

## Explorers and local setup

Copy `apps/website/.env.example` to `apps/website/.env.local` and `apps/app/.env.example` to `apps/app/.env.local` for optional overrides. Start the backend and both frontend dev servers. Visit:

- http://localhost:9001/api
- http://localhost:9002/api

The `/api` page is development-only and returns 404 in production. Public data handlers remain available in production. A small endpoint catalog in each app uses the shared UI ApiExplorer for loading, cancellation, status codes, timing, and JSON previews. Nothing is requested on page mount. Backend reachability is required when a request is run, not when building the frontend. If Next is containerized later, change its server base URL to the backend network hostname rather than localhost.

### Read-only migration status

1. Set `SHSG_ENABLE_DEV_DIAGNOSTICS=true` in each frontend `.env.local`.
2. For a host API, set it in `apps/api/.env` with `SHSG_ENVIRONMENT=local`. For Docker, set it in root `.env` and recreate the API using `docker compose up -d api`.
3. Restart Next dev servers and any host API to refresh settings.

Both sides enforce the gate independently. The API requires local mode and the flag; the frontend requires development mode and the flag. Production mode blocks the endpoint even when flagged on. Responses contain only `tracking_table_exists` and `applied_revisions`. The repository uses a database-enforced read-only connection; a missing tracking table returns false/empty without creating it. No web endpoint executes Alembic or writes schema changes.

## Checks

```bash
pnpm --filter @shsg/api-client lint
pnpm --filter @shsg/api-client typecheck
pnpm --filter @shsg/api-client test
```

CI includes these alongside frontend builds and UI explorer tests. Backend tests verify diagnostic gates, redaction, read-only connection settings, and missing tracking tables. Real PostgreSQL status still requires an available configured database.

## Testing changes locally

Run these from the repository root:

```bash
pnpm --filter @shsg/api-client test
pnpm --filter @shsg/api-client --filter @shsg/website --filter @shsg/app typecheck
pnpm --filter @shsg/api-client --filter @shsg/website --filter @shsg/app lint
pnpm format:check
```

The client tests exercise both app-owned ApiClient classes with injected Axios adapters. They require no running backend or database and cover resource URLs, service-ID validation, cancellation, timeouts, safe errors, configuration, and proxy gates. Successful response shapes rely on the backend contract rather than runtime decoders.

For an end-to-end manual check:

1. Start PostgreSQL, migrations, and FastAPI with `docker compose up --build -d`.
2. In separate terminals run `pnpm dev:website` and `pnpm dev:app`.
3. Open each development `/api` explorer and run health, readiness, service list, and service details. Health should return 200; readiness should return 200 when PostgreSQL is ready.
4. Enter `missing` as the service ID: expect 404. With diagnostics disabled, `/api/internal/migrations` should return 404 in both apps.
5. Stop the API and run health again: expect a sanitized 502 response, without upstream host or exception details. Restart with `docker compose up -d api` afterward.

Use the migration diagnostics setup above to verify applied revisions. This is read-only; migrations continue to run through Docker/Alembic.
