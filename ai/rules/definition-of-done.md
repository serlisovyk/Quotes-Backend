# Definition of Done

A change is done when all of the following hold. Use it as the gate before handing a change over for
approval.

## Code

- New code follows `ai/rules/architecture.md`, `ai/rules/api.md` and `ai/rules/style.md`: the layer
  that owns it, kebab-case files with role suffixes, `#` aliases.
- External input is validated before a controller reads it; a service never validates or parses
  request data.
- Errors are `AppError` subclasses with `ERROR_CODE` and `ERROR_MESSAGE`, answered in the API error
  shape; no repeated string literals.
- Shared values come from `constants/`; environment variables only through `config/app.config.js`.
- No comments in code.
- Stale code, constants, validators and messages left behind by the change are removed.
- Nothing from `ai/rules/scope.md` or the rejected ideas it names slipped in.

## Tests

- New or changed behavior has tests next to the module (`ai/rules/testing.md`); a new route has a
  Supertest test for success and error cases.
- Tests mock models and transactions; none touches a real database, and none was changed only to make
  it pass.

## Docs (in the same change, as `ai/rules/docs.md` says)

- `README.md`: only if setup, scripts, env or the public API changed.
- `ai/map.md`: only if a file, folder, route, model, env variable, script or Docker file was added,
  renamed or removed.
- `ai/rules/*` or `ai/skills/*`: only if the change reshaped a pattern.
- `ai/decisions/`: a new dated record if the change meets the criteria in its `README.md`.
- Every relative link in the docs still resolves.

## Verification

- Every check listed under "Verification" in `AGENTS.md` passes.
- A change to an endpoint, validation or an error was called by hand against a running server
  ("Manual API check" in `AGENTS.md`), error cases included: green tests do not prove it works.
- A change to Docker, compose, a port or an env variable also passes `docker compose config` and
  `docker compose -f docker-compose.dev.yml config`.
- Reported: what changed, which commands were run, whether they passed, and anything that could not
  be verified. Never claim the project works, tests or formats correctly unless the command was run and
  passed.

## Commits

- Logical commits, Conventional Commits in English, specific (never `update` or `changes`).
- `git status` and `git diff` inspected before each commit; the pre-commit hook is never bypassed.
