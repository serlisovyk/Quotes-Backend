# Agent Instructions

This is the canonical instruction file for **every** AI agent working in this repo. `CLAUDE.md` and
any other tool-specific entry point point here — keep shared knowledge in `ai/`, not duplicated per
tool.

## Project

The REST API of a quotes application: quotes and categories, listing with pagination and search,
random quotes, CRUD for quotes, a PostgreSQL database behind Sequelize. Express 5 in JavaScript ESM,
Express Validator, Vitest and Supertest tests, Docker Compose. No TypeScript, no authentication, no
repository layer. Keep the code clean, practical, and proportional to the project size; the project
is used for backend learning, so clarity matters more than clever abstractions.

- Repo: <https://github.com/serlisovyk/Quotes-Backend>
- Tasks: Linear, project [Quotes](https://linear.app/serhii-lisovyk-workspace/project/quotes-c2a87d7aca86)
  (team `MY`, issues `MY-<n>`, label `Backend`)
- The frontend is a separate repo, <https://github.com/serlisovyk/Quotes-Frontend>, with its own rules
  and workflow; changes there are separate tasks, not part of backend work.

## Read First

- `ai/map.md` — where layers, routes, models, seed scripts, env variables and Docker files live, what
  the project deliberately does **not** have. Read it before exploring the code from scratch.
- The rules of the area you touch, in `ai/rules/`: `architecture.md` for layers and boundaries,
  `api.md` for validation, errors and responses, `style.md` for JavaScript, `testing.md` for tests,
  `scope.md` for what not to add without an explicit request.
- `ai/rules/definition-of-done.md` — the gate before a change is handed over; `ai/rules/docs.md` — one
  fact one home, no history in docs.
- `ai/superpowers/` is the archive of past plans and specs: read only the plan or spec of the feature
  you change.

## Decisions

`ai/decisions/` records durable decisions and **why** they were made. Start from its `README.md`
index and read the records of what you touch, before proposing to change or "restore" anything —
rules say what to do now, decisions say why. Reversing one means a new dated record, not editing the
old one.

Propose a new record, without being asked, when a decision meets the criteria in that `README.md`.

## Workflow

`ai/workflow.md` is the end-to-end flow for a Linear task: orient → plan (+ spec when API behavior
changes) → implement → docs → verify → Definition of Done → self-review → report → author approval →
local merge into `main`.

The parts that never bend:

- Never commit task work directly on `main` — use a `my-<n>-<slug>` branch.
- Write a **plan** for anything non-trivial, and a **spec** when observable API behavior changes,
  under `ai/superpowers/` — one commit, before any code.
- Nothing is merged and no issue is marked `Done` without the author's explicit approval.
- Merges happen locally into `main`, then `main` is pushed. No pull requests, no pushed feature
  branches, and never a force-push of `main`.
- Never bypass a pre-commit hook (`--no-verify`).
- Tests stay: a change of behavior comes with tests.

Prompts to start agent sessions live in `ai/prompts/` (index in `ai/prompts/README.md`):
`orchestrator.md` runs several tasks from one session, `task.md` runs a single task. Linear issues
follow `ai/linear-task-template.md`.

## Skills

Skill playbooks live in `ai/skills/` (tool-agnostic Markdown, index in `ai/skills/README.md`):

- `endpoint` — how an endpoint flows through constants, validator, route, controller, service, query
  builder and tests.
- `review` — self-review for regressions, API contract, missing tests, scope creep, and docs drift.

If a change materially reshapes a pattern, update the matching skill in the same change
(`ai/rules/docs.md`).

## Working Principles

- Prefer small, focused changes.
- A feature lands in the layer that owns it (`ai/rules/architecture.md`): controllers handle HTTP,
  services hold the logic and the Sequelize calls, validators check the input.
- Follow the existing folder structure, file naming and patterns.
- Do not add new abstractions unless they remove real duplication or clarify a boundary.
- Do not rewrite working code just to make it look different.
- Keep the project approachable for a backend learner.
- If a request conflicts with these rules, follow the user's explicit request and mention the
  tradeoff.

## Project Defaults

- Package manager: `npm`; keep `package-lock.json`, no other lockfile, and do not edit it by hand
  unless there is no safer option. Install with `npm ci`.
- Stack: Node.js, Express 5, JavaScript ESM, PostgreSQL with Sequelize, Express Validator.
- Sources: everything under `src/`; `src/main.js` is the entry. `ai/map.md` shows where each part
  lives.
- Tests: Vitest and Supertest, next to the modules (`ai/rules/testing.md`).
- Formatting: Prettier (`.prettierrc`); `npm run format` applies it.

## Language

- Chat with the author in Russian.
- Code, commit messages, specs, plans, prompts, and `ai/` docs stay in English.
- Linear issues are written in Russian, following `ai/linear-task-template.md`.

## Verification

Run before handing over any change:

```bash
npm run format:check
npm test
```

- If formatting was changed, run `npm run format`.
- On a Windows checkout `format:check` may fail on CRLF for every file until MY-218 sets
  `endOfLine: auto` (decision `line-endings-auto`); then run `npx prettier . --check --end-of-line auto`
  and report both results.
- For a change to Docker, compose, a port or an env variable, also run `docker compose config` and
  `docker compose -f docker-compose.dev.yml config`.
- Then call every affected endpoint by hand — a green test run does not prove an endpoint works
  (decision `manual-api-check-throwaway-postgres`).
- If a check cannot be run, report that clearly. Do not claim the project works, tests or formats
  correctly unless the command ran successfully.

### Manual API check

Every task uses its own throwaway Postgres container and its own ports, never the author's database,
`.env` or compose stack:

```bash
docker run -d --rm --name quotes-pg-my-<n> -e POSTGRES_USER=quotes -e POSTGRES_PASSWORD=quotes -e POSTGRES_DB=quotes -p <db-port>:5432 postgres:16-alpine
DATABASE_URL=postgres://quotes:quotes@localhost:<db-port>/quotes DB_DIALECT=postgres APP_PORT=<port> npm run dev
```

Call the endpoints with curl — the happy path and the error cases — then stop the server and run
`docker stop quotes-pg-my-<n>`. The database starts empty: `sequelize.sync()` creates the tables at
startup, and the data for a check is made through `POST /quotes`. Do not run the destructive seed
unless the task is about seeds.
