# Spec: welcome root, database-aware health, 503 and shutdown timeout (MY-331)

Branch `my-331-root-health`. Linear issue MY-331.

## Problem

- `GET /` answers `404`: the API has no entry point.
- `GET /health` answers `200` even when Postgres is down, so the compose healthchecks report a
  healthy server that cannot serve any data endpoint.
- A database connection failure reaches a client as a generic `500 INTERNAL_SERVER_ERROR`.
- Graceful shutdown has no timeout: a hanging connection keeps the process alive after a signal.

## Behavior

### `GET /`

`200`, a welcome message plus navigation over the endpoints (author's decision, 2026-11-06):

```json
{
  "name": "Quotes API",
  "message": "Welcome to the Quotes API",
  "description": "REST API for quotes and categories: listing with pagination and search, random quotes, CRUD for quotes.",
  "repository": "https://github.com/serlisovyk/Quotes-Backend",
  "endpoints": [
    { "method": "GET", "path": "/health" },
    { "method": "GET", "path": "/quotes" },
    { "method": "GET", "path": "/quotes/random" },
    { "method": "GET", "path": "/quotes/:id" },
    { "method": "POST", "path": "/quotes" },
    { "method": "PATCH", "path": "/quotes/:id" },
    { "method": "DELETE", "path": "/quotes/:id" },
    { "method": "GET", "path": "/categories" },
    { "method": "GET", "path": "/categories/:id" }
  ]
}
```

- Mounted before the general rate limiter, like `/health`, and not request-logged.
- The paths are built from `ROUTE` and `ROUTER_PATH`, not typed a second time.

### `GET /health`

The database is checked with `sequelize.authenticate()`.

| Database    | Status | Body                                               |
| ----------- | ------ | -------------------------------------------------- |
| reachable   | `200`  | `{ "status": "ok", "database": "ok" }`             |
| unreachable | `503`  | `{ "status": "error", "database": "unavailable" }` |

- The `503` body is the health payload, not the common error shape.
- Still outside the rate limiters and not request-logged. A failed check is logged as a warning.
- The compose healthchecks keep calling `/health`; from now on they also turn unhealthy while the
  database is down.

### Connection errors on data endpoints

A Sequelize `ConnectionError` (and its subclasses: refused, timed out, host not reachable, ...) is
answered as `503` in the common error shape, and still logged:

```json
{
  "error": {
    "code": "SERVICE_UNAVAILABLE",
    "message": "Service unavailable, please try again later"
  }
}
```

### Graceful shutdown

- If `server.close` has not finished `SHUTDOWN_TIMEOUT_MS` (10 seconds) after the signal, the process
  logs an error and exits with code `1`.
- A second `SIGINT` / `SIGTERM` while a shutdown is running is ignored.

## Out of scope

Readiness vs liveness split, a separate database endpoint, response time metrics, an OpenAPI
document at `/`, retries or a circuit breaker for the database.
