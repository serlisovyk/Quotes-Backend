# Plan: welcome root, database-aware health, 503 and shutdown timeout (MY-331)

Branch `my-331-root-health`. Linear issue MY-331. Spec: `ai/superpowers/specs/2026-11-06-root-health.md`.

## Goal

`GET /` is the front door of the API, `/health` tells the truth about the database, connection errors
are `503`, and a shutdown cannot hang forever.

## Author's answers

- `GET /` is a welcome message of the API plus navigation over the endpoints.

## Decisions in the plan

- **Root layers:** `routes/root` + `controllers/root` (same pattern as `health`), no service: the
  payload is static. The payload and the endpoint list are constants in `constants/app.constant.js`
  (`API_INFO`, `API_ENDPOINTS`), the endpoint paths built from `ROUTE` and `ROUTER_PATH`.
  Rejected: a list computed from the Express router stack (couples the root to Express internals).
- **Mount:** `ROUTE.ROOT = '/'` in `ROUTE`; `app.use(ROUTE.ROOT, rootRouter)` before the general
  limiter, next to `/health`; added to `SKIPPED_REQUEST_LOG_ROUTES`.
- **Health:** new `services/health` with `isDatabaseAvailable()`: `sequelize.authenticate()`, returns
  a boolean, logs a failure with `Logger.warn`. The controller picks `200` or `503` and the body from
  constants (`HEALTH_STATUS`). A new `sendServiceUnavailable(res, data)` helper in `utils/http/response`.
- **503 errors:** `ServiceUnavailableError` (`HTTP_STATUS.SERVICE_UNAVAILABLE`,
  `ERROR_CODE.SERVICE_UNAVAILABLE`, `ERROR_MESSAGE.SERVICE_UNAVAILABLE`). `ErrorFactory.from` maps
  `instanceof ConnectionError` (imported from `sequelize`, allowed in `errors/`). `shouldLog` is
  unchanged: the original error is not an `AppError`, so it is logged.
- **Shutdown:** `SHUTDOWN_TIMEOUT_MS = 10 * 1000` constant; an `isShuttingDown` flag inside
  `registerGracefulShutdown`; a `setTimeout` that logs and calls `process.exit(1)`.
- No decision record: it follows the issue and existing rules.

## Changes

- `constants`: `ROUTE.ROOT`, `API_INFO`, `API_ENDPOINTS`, `HEALTH_STATUS`, `SHUTDOWN_TIMEOUT_MS`,
  `HTTP_STATUS.SERVICE_UNAVAILABLE`, `ERROR_CODE.SERVICE_UNAVAILABLE`, `ERROR_MESSAGE.SERVICE_UNAVAILABLE`.
- `errors`: `ServiceUnavailableError`, barrel, `ErrorFactory` mapping.
- `routes/root`, `controllers/root`, `services/health`, `controllers/health` changed, `app.js`.
- `utils/server/graceful-shutdown`: timeout and repeat-signal guard.
- Docs: `README.md` (`/`, `/health`, `503` row, healthcheck note), `ai/rules/api.md` (503, root),
  `ai/map.md` (root and health entries, folders), `ai/skills/review.md` if it names `/health`.

## Tests

- Root controller and router; health controller (200 / 503) and service (resolve / reject);
  `ErrorFactory` for `ConnectionError` and a subclass; `ServiceUnavailableError`;
  `sendServiceUnavailable`; the app test: `/` answers `200`; graceful shutdown with fake timers:
  forced `exit(1)` after the timeout, no forced exit when the close finishes, a second signal ignored.

## Verification

- `npm run lint`, `npm run format:check`, `npm test`.
- Manual (own port 4331, throwaway Postgres `quotes-pg-my-331` on db port 55331 when Docker runs;
  otherwise an unreachable `DATABASE_URL`): `/`, `/health` up and down, `GET /quotes` down, SIGTERM.
