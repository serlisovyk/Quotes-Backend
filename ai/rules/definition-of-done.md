# Definition Of Done

A change is done when every point below holds. Walk the list before the self-review (step 9 of [`ai/workflow.md`](../workflow.md)).

## Code

- Layers and boundaries follow [architecture.md](architecture.md); nothing from [scope.md](scope.md)'s "Do Not Add" list was added.
- Style follows [style.md](style.md): naming, aliases, folder indexes, Prettier formatting.
- External input is validated with Express Validator and reaches services already normalized ([validation-errors.md](validation-errors.md)).
- Errors use `AppError` subclasses, `ERROR_CODE` and `ERROR_MESSAGE`, and the API error shape from [validation-errors.md](validation-errors.md); no repeated string literals.
- Reused values come from `src/constants` or `src/config/app.config.js`.
- Code made unused by the change (constants, helpers, validators, error messages) is removed.

## Tests

- New or changed behavior has tests next to the module, following [testing.md](testing.md); a new route has a Supertest test for success and error cases.
- Tests mock models and transactions, never a real database.
- Existing tests were changed only when the behavior they describe changed on purpose.

## Docs

Same change, following [docs.md](docs.md):

- `README.md` if setup, scripts, env variables or the public API changed.
- `ai/map.md` if a file, route, model, env variable, script or Docker file was added, renamed or removed.
- `ai/rules/*` and `ai/skills/*` if a pattern changed.
- `ai/decisions/` has a dated record if a durable decision was settled or reversed.
- `ai/superpowers/` has the plan (and spec when API behavior changed), committed before the code.

## Checks

- `npm run format:check` and `npm test` pass; the `lint` script is added to `AGENTS.md` by the task that introduces it.
- For Docker, compose, port or env changes: `docker compose config` and `docker compose -f docker-compose.dev.yml config` pass.
- The affected endpoints were called with curl against `npm run dev` on a throwaway Postgres ([recipe](../../AGENTS.md#manual-api-check)), including error cases; green tests alone do not prove the endpoint works.
- The report states which commands were run, whether they passed, and what could not be verified.

## Commits

- Logical commits, Conventional Commits in English, specific messages (never `update` or `changes`).
- `git status` and `git diff` inspected before every commit; no `--no-verify`.
