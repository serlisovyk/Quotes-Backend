# Plan: strict rate limit on writes (MY-329)

Branch `my-329-write-rate-limit`. Linear issue MY-329, milestone «Баги и безопасность». Spec:
`ai/superpowers/specs/2026-11-06-write-rate-limit.md`.

## Goal

Writes to `/quotes` get their own limit of 20 requests per 15 minutes per IP; both limiters answer
`429 TOO_MANY_REQUESTS` in the API error shape.

## Author's answers

- Protection of writes is only a stricter rate limit: no CORS restriction, no `READ_ONLY` flag, no
  API key.
- Write limit: 20 requests per 15 minutes per IP.
- Both limiters answer 429 in the API error shape.

## Decisions in the plan

- **Where the write limiter is mounted:** in the quotes router, as the first handler of the `POST`,
  `PATCH` and `DELETE` routes. Rejected: a method check inside one `app.use` limiter (hides which
  routes are limited) and mounting in `app.js` with `skip` on method (same). Reads never touch it.
- **Where the code lives:** `middlewares/rate-limit/` with a factory `createRateLimiter({ windowMs,
limit })` and two ready limiters, `generalRateLimiter` and `writeRateLimiter`. The factory takes
  options so tests use a small limit; production values come from constants.
- **429 body:** the limiter's `handler` calls `next(new TooManyRequestsError(...))`, so the central
  error middleware builds the body. `express-rate-limit` still sets the headers before the handler.
- **Window:** the existing `MINUTES_IN_MS.FIFTEEN` for both.
- `trust proxy` stays in `app.js` before the limiters (decision `trust-proxy-hop-count`).
- No decision record: it follows the author's answers and `rejected-features`.

## Changes

- `constants`: `HTTP_STATUS.TOO_MANY_REQUESTS`, `ERROR_CODE.TOO_MANY_REQUESTS`,
  `ERROR_MESSAGE.TOO_MANY_REQUESTS`, `WRITE_RATE_LIMIT_MAX_REQUESTS = 20`.
- `errors/classes`: `TooManyRequestsError`, exported from the barrel, covered in `http-errors.test.js`.
- `middlewares/rate-limit`: the factory (`standardHeaders: 'draft-6'`, `legacyHeaders: false`),
  `generalRateLimiter`, `writeRateLimiter`, barrel, tests.
- `app.js`: uses `generalRateLimiter`, drops the direct `express-rate-limit` import.
- `routes/quotes`: `writeRateLimiter` before the validators of `POST`, `PATCH`, `DELETE`.
- Docs: `README.md` (rate limits, `429` in the error table), `ai/rules/api.md` (429),
  `ai/map.md` (middlewares, endpoints note), `ai/skills/endpoint.md` if it lists the route chain.

## Tests

Supertest on a small app with `createRateLimiter({ windowMs, limit: 2 })`: the N+1st write is 429
with the API error body and `RateLimit-*` headers; a read still answers 200 after writes are
limited; the general limiter answers the same body. The quotes router test keeps passing with the
real write limiter (it makes far fewer than 20 writes).

## Verification

- `npm run lint`, `npm run format:check`, `npm test`.
- Manual: the limiter needs no database. Run `src/app.js` on port 4329, send 21 `POST /quotes`
  (they fail validation or the database, but still count), confirm the 21st is 429 and a `GET`
  answers. The full Postgres check needs Docker.
