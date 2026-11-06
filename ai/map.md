# Repo map

Navigation only: where things live and who owns what. How it works is in the code, why in
`ai/decisions/`.

## Repo

- `src/` — all sources (below); `src/main.js` is the entry (`npm start`; `npm run dev` adds `node --watch`).
  Both scripts load `.env` with `--env-file-if-exists=.env` (decision `node-watch-and-env-file`).
- `package.json` — `engines` (Node `>=24`); scripts `dev`, `start`, `lint`, `lint:fix`, `format`,
  `format:check`, `prepare` (Husky), `test`, `test:watch`; the `#` import aliases in `imports`; `jsconfig.json` mirrors the aliases for editors only.
- `vitest.config.js` — runs `src/**/*.test.js` in the `node` environment with `clearMocks` and
  `restoreMocks`.
- `.env.sample` — every environment variable with a description; `.env*` is git-ignored.
- `.prettierrc`, `.prettierignore` — Prettier.
- `eslint.config.js` — ESLint flat config: recommended rules, Node globals, the architecture
  `no-restricted-imports` rules (decision `eslint-husky-ci`).
- `.husky/pre-commit`, `.lintstagedrc.json` — the pre-commit hook: lint-staged runs ESLint and Prettier
  on the staged files.
- `.github/workflows/ci.yml` — CI on every push: the `check` job (lint, format check, tests) and the `docker` job
  (builds the prod image, no push).
- `Dockerfile`, `Dockerfile.dev`, `docker-compose.yml`, `docker-compose.dev.yml`, `.dockerignore` —
  see "Docker".
- `README.md` — setup, scripts, the public API; `AGENTS.md` — the entry point for agents, `CLAUDE.md`
  points to it.
- `ai/` — agent docs: this map, `workflow.md`, `rules/`, `skills/`, `decisions/`, `prompts/`,
  `linear-task-template.md`, and the archive `superpowers/`.
- `.claude/worktrees/` — one git worktree per task when tasks run in parallel; ignored by git.

## Request flow

`main.js` syncs the database, resets the ID sequences and starts the server; `app.js` sets up the
middleware and mounts the routers. A request goes router → validators → `validationErrorHandler` →
`asyncHandler` → controller → service → model, and any error ends in `middlewares/error`. The layer
rules are in `ai/rules/architecture.md`.

## Sources (`src/`)

| Folder                  | Holds                                                                                     |
| ----------------------- | ----------------------------------------------------------------------------------------- |
| `config/`               | `app.config.js`, the one reader of environment variables, and its barrel                  |
| `constants/`            | app, error, query-option and validation constants                                         |
| `routes/<resource>/`    | `quotes`, `categories`, `health` routers                                                  |
| `validators/`           | `quote`, `category`, and `shared` (limit, offset, id, category name chains)               |
| `controllers/`          | `quotes`, `categories`, `health` handlers                                                 |
| `services/`             | `quotes` and `categories` logic and model calls                                           |
| `database/`             | `db.js` (the Sequelize instance), `models/` (with `associations.js`, `hooks/`), `seed/`   |
| `middlewares/`          | `async-handler`, `error`, `not-found`, `rate-limit`, `request-logger`, `validation-error` |
| `errors/`               | `classes/` (`AppError` and its subclasses), `factories/error/` (`ErrorFactory`)           |
| `logger/`               | `Logger` over `console`                                                                   |
| `utils/database/`       | sync, ID sequence reset, connection close, LIKE escaping                                  |
| `utils/http/`           | response helpers (`sendOk`, `sendCreated`, `sendNoContent`), request log line             |
| `utils/query-builders/` | quote, category and `iLike` filter query options                                          |
| `utils/seed/`           | CSV row parsing, stream pause, category validation and splitting                          |
| `utils/server/`         | graceful shutdown on SIGINT and SIGTERM                                                   |
| `utils/validation/`     | formats validation results into `fields`; removes duplicate category names                |
| `tests/`                | shared test mocks and helpers (`createRouterTestClient`, `runValidators`)                 |

Tests (`*.test.js`) sit next to the module they check.

## Path aliases

Native `package.json#imports`; the `#` prefix is the rule (`ai/rules/style.md`).

| Alias                                                                           | Resolves to                                                            |
| ------------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| `#config`, `#constants`                                                         | `src/config/index.js`, `src/constants/index.js`                        |
| `#controllers/*`, `#routes/*`, `#services/*`, `#validators/*`, `#middlewares/*` | the folder's `index.js`                                                |
| `#errors/*`                                                                     | `src/errors/*/index.js` (`#errors/classes`, `#errors/factories/error`) |
| `#utils/*`, `#tests/*`                                                          | `src/utils/*/index.js`, `src/tests/*/index.js`                         |
| `#database`, `#logger`                                                          | `src/database/db.js`, `src/logger/logger.service.js`                   |
| `#models`, `#models/hooks`                                                      | `src/database/models/index.js`, `.../models/hooks/index.js`            |

## Endpoints

Paths are constants in `constants/app.constant.js` (`ROUTE`, `ROUTER_PATH`). Everything mounted after
`/health` is rate limited (`generalRateLimiter`); `POST`, `PATCH` and `DELETE /quotes` also pass `writeRateLimiter`
(`middlewares/rate-limit`). Query and body rules are in the validators, answers in the controllers.

| Endpoint                                                  | Handler                                                              |
| --------------------------------------------------------- | -------------------------------------------------------------------- |
| `GET /health`                                             | `getHealth`: `{ "status": "ok" }`, not logged                        |
| `GET /quotes`, `GET /quotes/random`, `GET /quotes/:id`    | `getQuotes` (`{ total, quotes }`), `getRandomQuotes`, `getQuoteById` |
| `POST /quotes`, `PATCH /quotes/:id`, `DELETE /quotes/:id` | `postQuote`, `patchQuoteById`, `deleteQuoteById`                     |
| `GET /categories`, `GET /categories/:id`                  | `getCategories` (`{ total, categories }`), `getCategoryById`         |

## Database

- Models: `Quote` (`text`, `author`), `Category` (unique `name`), the join model `QuoteCategory`;
  `Quote` and `Category` are many-to-many through it (`database/models/associations.js`).
- `QuoteCategory` declares no attributes: Sequelize adds `QuoteId` and `CategoryId` itself.
- The `afterFind` hook of `Quote` turns the included categories into a `categories` array of names.
- No migrations: `sequelize.sync()` runs at startup, so it creates missing tables and never alters
  existing ones.

## Seed scripts

Run from the repo root with `node --env-file-if-exists=.env <script>`; the guide is
`src/database/seed/README.md`.

- `database/seed/scripts/import-quotes.seed.js` — destructive (`sync({ force: true })`), refuses to run
  unless `ALLOW_SEED_RESET=true`; imports `data/test-quotes.csv` in batches. It parses a row with
  `utils/seed/parse-quote-row` (no models, no services) and creates the quote and categories itself.
- `database/seed/scripts/remove-rare-categories.seed.js` — removes categories attached to one or two
  quotes, and quotes left without categories; not guarded, still mutates data.
- Both scripts close the database connection in `finally`, so the process exits by itself.
- `database/seed/sampleSQLQueries.sql` — queries for manual inspection.

## Environment

All keys are in `.env.sample`, read only in `config/app.config.js` from `process.env`, which Node fills
from `.env` through the `--env-file-if-exists` flag (the variables already in the environment win): `APP_PORT`, `DATABASE_URL`,
`DB_DIALECT`, `CSV_IMPORT_BATCH_SIZE`, `CSV_IMPORT_BATCH_TIMEOUT`, `ALLOW_SEED_RESET` for the app and
seeds; `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB`, `ADMINER_DEFAULT_SERVER` for the
containers.

## Docker

- `Dockerfile` — `node:24-alpine`, production dependencies installed with `--ignore-scripts`
  (decision `docker-build-from-dockerfile`), a non-root user, `npm start`, port 3001.
- `.dockerignore` — keeps out of the prod image `.git`, `.github`, `.husky`, `.claude`, `ai`, tests
  (`**/*.test.js`, `src/tests`), Markdown, and linter and test configs. The seed scripts and the CSV
  stay in the image.
- `Dockerfile.dev` — `node:24-alpine`, all dependencies, `npm run dev`, port 3001.
- `docker-compose.yml` — production-like: `postgres:16-alpine` and the `server` built from
  `Dockerfile`, healthchecks, `.env`.
- `docker-compose.dev.yml` — Postgres, the `server` built from `Dockerfile.dev` with the source
  mounted, and Adminer on port 8080.
- Neither compose file publishes the Postgres port, so manual API checks use a separate throwaway
  container (decision `manual-api-check-throwaway-postgres`).

## Deployment

Hosting is outside the repo: it has no hosting config (`vercel.json` was removed). The `trust proxy`
hop count assumes the proxy topology of the hosting (decision `trust-proxy-hop-count`). Agents never
recreate, reconnect or reconfigure a hosting project.

## Not in this project

- No TypeScript, repository layer, authentication, config validation, Swagger, dependency injection,
  Redis, GraphQL, tRPC, gRPC, metrics, background jobs or logging platform: `ai/rules/scope.md`,
  decision `rejected-features`.
- No migrations.
- No pull requests: work merges locally (decision `local-merge-without-pr`).
