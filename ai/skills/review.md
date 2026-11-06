---
name: review
description: Use to self-review a diff in the Quotes backend for regressions, scope creep, missing tests, API contract drift and docs drift before reporting a change done.
---

# Review

## When to use

Self-review pass before handing over any non-trivial change, per `ai/workflow.md`.

## Checklist

Walk the diff against `ai/rules/definition-of-done.md` and the rules of the areas it touches
(`architecture`, `api`, `style`, `testing`, `scope`). Then check what the rules do not cover:

- **Endpoints**: the status codes, the `Location` of a created resource, `204` with no body, an
  empty array for an empty list, `404` for a missing row, the `categories` array of names on a quote.
- **Validation**: every new input has a chain; a failure answers `400` with `VALIDATION_ERROR` and
  `fields` (`_root` for a request-wide error); numbers arrive as numbers; a bad ID or limit is
  rejected before a service runs.
- **Errors**: invalid JSON, an unknown route and an unexpected exception each answer in the error
  shape; nothing leaks a stack or a Sequelize message to the client.
- **Data**: writes that belong together share one transaction; a quote update keeps its categories
  unless the request replaces them; the seed guard (`ALLOW_SEED_RESET`) is intact.
- **Config and runtime**: environment variables only through `config/app.config.js`; `trust proxy`
  before the rate limiter; startup order in `main.js` unchanged; Docker and compose files still
  valid (`docker compose config`).
- **Tests**: changed behavior has tests next to the module; models and transactions are mocked; no
  test was weakened to pass.
- **Scope**: nothing from `ai/rules/scope.md` or the rejected features slipped in; no unrelated
  rewrites; removed behavior left no unused code, constants or messages.
- **Docs drift**: the docs still match the code, links resolve, and a decision record exists if a
  durable decision was made.

## Verification gaps to catch

- Tests green, but the endpoint was never called against a running server.
- Only the happy path was called: no validation failure, no missing row, no invalid JSON.
- `format:check` skipped, or its CRLF failure not rerun with `--end-of-line auto`.
- A Docker or env change without `docker compose config`.

## Report

State what was checked and what was found — fix it or say plainly why a finding is being left alone,
per `ai/workflow.md`'s report step.
