# Plan: integration tests on Postgres in CI, `npm audit` in CI (MY-333)

Branch `my-333-integration-tests`. Linear issue MY-333, milestone «Доработки бэкенда». No spec: the
API does not change.

## Goal

A small suite drives the real `src/app.js` through Supertest against a real Postgres, locally on the
throwaway container and in CI on a service container. CI also fails on a high or critical
vulnerability in production dependencies.

## Author's answers

- The script is `test:integration`.
- Add a row to `ai/decisions/2026-11-06-rejected-features.md`: database migrations (Umzug /
  sequelize-cli), because the schema does not change and `sync()` is enough (the author canceled
  MY-332).
- The test schema is created like the app's: `sequelize.sync()` with the associations from `#models`.

## Decisions in the plan

- **File pattern:** `*.int.test.js` under `src/tests/integration/`. Rejected: next to the modules
  (an integration test belongs to no single module).
- **Keeping them out of `npm test`:** `vitest.config.js` gets `exclude: ['src/**/*.int.test.js']`;
  a second config, `vitest.integration.config.js`, includes only `src/**/*.int.test.js`.
  Rejected: vitest `projects` (one config would run both on `vitest run`, so `npm test` would need
  a filter).
- **Environment:** the script does not use `--env-file-if-exists`, so the author's `.env` is never
  picked up and the suite cannot truncate a real database by accident. `DATABASE_URL` and
  `DB_DIALECT` must be set explicitly (the recipe in `AGENTS.md`; the CI job sets them). The
  integration config throws a clear error when `DATABASE_URL` is missing.
- **Database lifecycle:** a setup file calls `sequelize.sync()` once per test file (`beforeAll`),
  `sequelize.truncate({ cascade: true, restartIdentity: true })` in `beforeEach`, and
  `sequelize.close()` in `afterAll`. Truncate with restarted identities keeps ids predictable and is
  faster than `sync({ force: true })`, which drops and recreates tables. Files run one after
  another (`fileParallelism: false`): they share one database.
- **Rate limiters:** the write limiter allows 20 writes per 15 minutes per IP and the suite makes
  more. The setup file replaces `#middlewares/rate-limit` with pass-through limiters through
  `vi.mock`. Production code is untouched and the limiters keep their own unit tests
  (`rate-limit.middleware.test.js`). Rejected: staying under the limit (fragile, caps the suite) and
  an env-driven limit (a production knob only for tests).
- **Silence:** the logger is not mocked; the suite accepts the request log lines.
- **CI:** a new job `integration` with a `postgres:16-alpine` service container (health options),
  Node 24, `npm ci`, `npm run test:integration` with `DATABASE_URL` and `DB_DIALECT` in `env`. The
  `npm audit --omit=dev --audit-level=high` step goes into the existing `check` job. The `docker` job
  stays as is.
- **Decision records:** the migrations row in `rejected-features` (author's answer). The rest
  follows existing decisions (`tests-vitest-supertest`, `manual-api-check-throwaway-postgres`); the
  testing rule "a test never touches a real database" is narrowed to the unit suite in
  `ai/rules/testing.md`.

## Changes

- `vitest.config.js` (exclude), `vitest.integration.config.js`, `package.json` script
  `test:integration`, `eslint.config.js` (node globals for the new config).
- `src/tests/integration/`: `setup.js`, `helpers.js` (create a quote through `POST /quotes`),
  `quotes.int.test.js`, `categories.int.test.js`, `app.int.test.js`.
- `.github/workflows/ci.yml`: the `integration` job, the audit step.
- Docs: `AGENTS.md` (Verification), `ai/rules/testing.md`, `ai/map.md`, `README.md` (scripts, CI),
  `ai/decisions/2026-11-06-rejected-features.md` (migrations row), and `ai/rules/scope.md` if it lists
  the rejected ideas.

## Tests (focused, not a re-test of the units)

- Quotes: create with categories (201, `Location`, body); duplicate categories collapse; list with
  `limit`/`offset` and `total`, `author`, `text`, `search`, `category`, `sort` and `order`; PATCH
  incl. replacing categories; DELETE then 404; `GET /quotes/:id`; 400 validation with `fields`; 404
  for an unknown id.
- Categories: `GET /categories` answers `{ total, categories }`; `?name=` filters.
- App: `GET /` 200, `GET /health` 200 with the database, an unknown route 404, invalid JSON 400.
- A 409 case for duplicate quotes (MY-337) is added after that task merges, if the orchestrator asks.

## Verification

- `npm run lint`, `npm run format:check`, `npm test` (the unit suite must not pick up the
  integration files).
- `npm run test:integration` on a throwaway Postgres `quotes-pg-my-333` (db port 55333). If Docker is
  down, check the files with `node --check` and lint, and the suite first runs in CI.
- `docker compose config` is not needed: no Docker, compose or env file changes.
