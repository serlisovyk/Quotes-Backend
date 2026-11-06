# Plan: `node --watch` and `--env-file-if-exists` instead of nodemon and dotenv (MY-334)

Branch `my-334-node-watch-env-file`. Linear issue MY-334, milestone «Доработки бэкенда». No spec:
API behavior does not change.

## Goal

Drop two dependencies that Node 24 (`engines.node >=24`, Docker `node:24-alpine`) already covers:
`nodemon` (and its dev-only `minimatch` advisory) and `dotenv`.

## Node facts relied on (checked on Node 24.12)

- `--env-file-if-exists=<path>` loads the file when it exists; a missing file prints a one-line
  notice to stderr and the process continues (unlike `--env-file`, which exits with an error).
- It does **not** override variables already set in the environment: `FOO=fromenv node
--env-file-if-exists=.env` keeps `fromenv`. So compose `env_file`, CI and shell variables win over
  a `.env` on disk, the same as `dotenv` did by default.
- The flag only fills `process.env` before the entry module starts, so it must be on every command
  line that starts the app or a seed script; there is no in-code replacement for
  `import 'dotenv/config'`.
- `--watch` restarts the process when the entry file or any module it imports changes (the module
  graph is watched, not the directory), so editing tests, Markdown or the CSV does not restart the
  server. `--watch-path` is therefore not needed. To be confirmed by hand in the checks.

## Approach

- `package.json`: `dev` is `node --watch --env-file-if-exists=.env src/main.js`, `start` is
  `node --env-file-if-exists=.env src/main.js`; remove `nodemon` and `dotenv`; `npm uninstall` keeps
  `package-lock.json` in sync.
- `src/config/app.config.js`: remove `import 'dotenv/config'`. The module only reads `process.env`.
- Entry points and where their variables come from:
  - `npm start`, `npm run dev`: the flag reads `.env` if present.
  - Docker prod: `Dockerfile` CMD stays `npm start`; the flag finds no `.env` (`.dockerignore`
    excludes `.env*`) and the variables come from compose `env_file`.
  - Docker dev: `npm run dev` on the mounted source; `.env` is in the mount and compose passes the
    same variables, which win.
  - Seed scripts: run as `node --env-file-if-exists=.env src/database/seed/scripts/<name>.seed.js`
    (README and `src/database/seed/README.md`). In the prod image the variables come from the
    container environment.
  - Vitest: tests mock the modules they need and never import `.env`; checked by running them
    without `.env`.
- Docs: README (scripts, seed, env), `src/database/seed/README.md`, `ai/map.md`, `ai/rules/scope.md`
  (dependency and tooling lists).
- Decision: a new record `node-watch-and-env-file` (why no `nodemon` and `dotenv`, the
  no-override rule); `package-json-choices` is not rewritten.

## Verification

- `npm ls nodemon dotenv` is empty; `npm ci` on the final lockfile.
- `npm run lint`, `npm run format:check`, `npm test` (also with no `.env` present).
- By hand: `npm run dev` with a temporary `.env` (`APP_PORT`) restarts on a `src/` edit and not on a
  test edit; `npm start` with no `.env` and variables in the environment; a seed script started
  with variables from `.env` reaches the database step. If Docker is up: throwaway Postgres
  `quotes-pg-my-334`, the `remove-rare-categories` seed against it, and
  `docker compose -f docker-compose.dev.yml config`.
