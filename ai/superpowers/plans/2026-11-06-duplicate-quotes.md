# Plan: duplicate quote protection (MY-337)

Branch `my-337-duplicate-quotes`. Linear issue MY-337, milestone «Доработки бэкенда». Spec:
`ai/superpowers/specs/2026-11-06-duplicate-quotes.md`. Blockers MY-330 and MY-335 are in `main`.

## Goal

A write that would produce a second quote with the same text and author answers `409 CONFLICT`.

## Author's answers (2026-11-06)

- A duplicate is the same `text` and `author` after `trim`, case-insensitive.
- No unique index in the database: the check runs in the service, in the same transaction as the
  write.
- Migrations were rejected (MY-332 canceled): no schema change at all.

## Changes

- `constants/app.constant.js`: `HTTP_STATUS.CONFLICT = 409`.
- `constants/errors.constant.js`: `ERROR_CODE.CONFLICT` and `ERROR_MESSAGE.QUOTE_ALREADY_EXISTS`.
- `errors/classes/conflict.error.js`: `ConflictError`, exported from the barrel; no factory change
  (it passes an `AppError` through). The error middleware already sets `no-store` (MY-336).
- `utils/query-builders/quote-query-builder`: `buildDuplicateQuoteQuery({ text, author, excludeId })`
  returns `{ where }`: `lower(text)` and `lower(author)` equal to the lowercased values, plus
  `id != excludeId` when given.
- `services/quotes`: a private `assertQuoteIsUnique({ text, author, excludeId }, transaction)` runs
  `Quote.findOne` with that query and throws `ConflictError(ERROR_MESSAGE.QUOTE_ALREADY_EXISTS)`.
  `createQuote` calls it first in the transaction. `modifySingleQuote` computes the resulting text and
  author from the stored quote plus the patch and calls it with `excludeId: id` before `save`, so a
  conflict changes nothing; the same quote never conflicts with itself.
- No controller or router change: the error travels through `asyncHandler` to the error middleware.
- Tests: `ConflictError`; the query builder; the service (conflict on create and modify, no
  `create`/`save`/`setQuoteCategories` after a conflict, the resulting values on a partial patch,
  `excludeId`); the controller and the router (`409` shape through `createRouterTestClient` with a
  service that rejects).
- Docs: `README.md` error table (`409`); `ai/rules/api.md` (the duplicate rule and the accepted
  race); the `endpoint` skill recipe "A new error" needs no change.

## Accepted risk

Without an index, two simultaneous identical `POST` requests can both pass the check inside their own
transactions and both be stored (the default isolation does not serialize them). This is the author's
decision; the check still stops the usual case, a repeated POST. Rows that are already duplicates stay.

A quote with a `null` author (seed data) never matches (`lower(NULL) = x` is not true), so it is never
reported as a duplicate.

## Verification

- `npm run lint`, `npm run format:check`, `npm test`.
- Manual with Docker if it runs: throwaway Postgres `quotes-pg-my-337` (port 55337), the app on
  4337: POST twice (`409`, one row), POST with other case and surrounding spaces (`409`), same text
  with another author (`201`), PATCH into another quote's text and author (`409`), PATCH of the same
  quote to its own values and a categories-only PATCH (`200`). Otherwise the service, controller and
  router tests only, and the report says it was not run live.
