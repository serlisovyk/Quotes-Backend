# Plan: Cache-Control and response compression (MY-336)

Branch `my-336-cache-compression`. Linear issue MY-336. Spec: `ai/superpowers/specs/2026-11-06-cache-compression.md`.

## Author's answers

- Reads are cached for 60 s (`public, max-age=60`); random quotes and health are `no-store`.

## Decisions in the plan

- **Where the header is set:** a small `cacheControl(value)` middleware factory in
  `middlewares/cache-control`, listed in the route chain first
  (`router.get(path, cacheControl(CACHE_CONTROL.PUBLIC_SHORT), validators, ...)`). It only sets the header.
- **Errors:** the error middleware sets `Cache-Control: no-store` before it answers, which overrides
  the header a route middleware set earlier. Every error (validation, not found, 429, 500, 503) goes
  through it, so none can end up `public, max-age=60`. A `404` is heuristically cacheable (RFC 9111),
  hence an explicit `no-store` rather than "no header". Errors raised before a route (`express.json`)
  reach the same middleware.
  Rejected: setting the header in `sendOk` (a response helper that would have to know the route);
  a global middleware that patches `res.writeHead` for 2xx (clever, hard to read for a learner).
- **Health:** `no-store` by middleware on the health route; its `503` goes through
  `sendServiceUnavailable`, not the error middleware, so the route-level header is what covers it.
- **Random quotes:** `no-store` by middleware on the route.
- **Root:** `public, max-age=60`, the same constant as the reads (see the spec).
- **Writes:** no middleware, no header.
- **Compression:** `app.use(compression())` after `helmet()` and `cors()`, before the body parser and
  the routes; default options (threshold 1 kb, gzip/deflate/br negotiation). New production dependency
  `compression` (1.8.x, no peer requirement, works with Express 5).
- **Constants:** `CACHE_MAX_AGE_SECONDS = 60`, `CACHE_CONTROL = { PUBLIC_SHORT, NO_STORE }` in
  `constants/app.constant.js`.
- No decision record: it follows the issue.

## Changes

- `package.json`, `package-lock.json`: `compression`.
- `constants`: `CACHE_MAX_AGE_SECONDS`, `CACHE_CONTROL`.
- `middlewares/cache-control` (+ test); `middlewares/error` sets `no-store` (+ test, `set` in the response mock).
- `routes/{root,health,quotes,categories}`: `cacheControl(...)` on the GET routes.
- `app.js`: `compression()`.
- Docs: `README.md` (caching and compression, feature list), `ai/rules/api.md` (cache rule),
  `ai/map.md` (middleware, endpoints), `ai/skills/endpoint.md` if it lists the route chain.

## Tests

- `cacheControl` sets the header and calls `next`; the error middleware sets `no-store`.
- App tests (Supertest, mocked services): header per GET route; a `404` by id, a `400` validation
  error and an unknown route are `no-store`; `/health` `200` and `503` are `no-store`; a write has no
  `Cache-Control`; `GET /quotes` with a large mocked body and `Accept-Encoding: gzip` gets
  `Content-Encoding: gzip`, without the header it does not.

## Verification

- `npm run lint`, `npm run format:check`, `npm test`, `npm audit --omit=dev`.
- Manual on port 4336 (throwaway Postgres `quotes-pg-my-336`, db port 55336, when Docker runs;
  otherwise `/`, `/health` 503, `400` and `404` without a database, list answers covered by tests only).
