# Manual API checks run on a throwaway Postgres container

Date: 2026-11-06 · Status: accepted

## Context

Green tests mock the database, so an endpoint is also called by hand. The compose files do not
publish the Postgres port, and tasks run in parallel, each needing its own database. The author's
own database, `.env` and compose stack must stay untouched.

## Decision

- Each task starts its own `postgres:16-alpine` container on its own host port, runs
  `npm run dev` on its own `APP_PORT` with `DATABASE_URL` pointing at it, calls the endpoints with
  curl, and stops both. The recipe is "Manual API check" in `AGENTS.md`.
- The database starts empty: `sequelize.sync()` creates the tables, and the data for a check is made
  through `POST /quotes`. The destructive seed runs only when the task is about seeds.

## Consequences

- No task depends on, or can damage, the author's database or compose stack.
- Rejected: the dev compose stack (it publishes no Postgres port and its names are fixed, so parallel
  tasks would collide).
