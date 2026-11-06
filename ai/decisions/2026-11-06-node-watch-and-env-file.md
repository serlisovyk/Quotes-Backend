# Node's `--watch` and `--env-file-if-exists` replace nodemon and dotenv

Date: 2026-11-06 · Status: accepted

## Context

The project requires Node 24 (`engines`, Docker, CI). Node already restarts on changes (`--watch`)
and loads `.env` files (`--env-file-if-exists`), which is all `nodemon` and `dotenv` were used for.
`nodemon` also brought the dev-only `minimatch` advisory.

## Decision

- `npm run dev` is `node --watch --env-file-if-exists=.env src/main.js`; `npm start` is
  `node --env-file-if-exists=.env src/main.js`. `nodemon` and `dotenv` are not dependencies and
  `import 'dotenv/config'` is gone.
- Every command that starts code reading `process.env` (the app, the seed scripts) passes the flag;
  the code does not load `.env` itself. Tests never need `.env`.
- The `-if-exists` form, not `--env-file`: without a `.env` (the prod image excludes `.env*`) Node
  prints a notice and goes on, and the variables come from the environment, e.g. compose `env_file`.
- Variables already in the environment are not overridden by `.env`, the same precedence `dotenv`
  had.
- `--watch` follows the imported modules, so editing tests or docs does not restart the server;
  `--watch-path` is not needed.

## Consequences

- A new entry point must repeat the flag; forgetting it leaves `process.env` without the `.env` values.
- Rejected: keeping `dotenv` (an in-code import that every entry point had to remember, and one more
  dependency) and keeping `nodemon` (an extra package and advisory for what `node --watch` does).
