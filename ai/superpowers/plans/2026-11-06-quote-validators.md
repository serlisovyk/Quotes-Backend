# Plan: quote validators (MY-225)

Branch `my-225-quote-validators`. Linear issue MY-225, milestone «Баги и безопасность». Spec:
`ai/superpowers/specs/2026-11-06-quote-validators.md`.

## Goal

Bring `validators/quote` to `ai/rules/api.md` (messages and numbers from constants) and close the
holes: numeric `text`, duplicate categories, an empty `PATCH`.

## Author's answers

- Duplicate categories: a sanitizer in the validator removes repeats silently, not a 400. The
  service does not validate again.
- Empty `PATCH` (no fields): 400 «nothing to update» under `_root`.

## Changes

- `constants/validation.constant.js`: `QUOTE_TEXT_MIN_LENGTH`, `QUOTE_AUTHOR_MIN_LENGTH`,
  `QUOTE_AUTHOR_MAX_LENGTH`, `QUOTE_PATCH_FIELDS`.
- `constants/errors.constant.js`: one block of new `ERROR_MESSAGE` entries (text, author, categories,
  random limit, offset, nothing to update), built from the constants.
- `validators/quote`: `isString()` with `bail()` before `trim()` for `text` and `author`; messages
  from `ERROR_MESSAGE`; `withMessage` on the random `limit`; the categories chain removes duplicates
  and runs after the item chain, so the names are trimmed first; an empty-`PATCH` chain on the whole
  body.
- `validators/shared`: `withMessage` on `offsetQueryValidator` (also used by `GET /categories`).
  `GET /quotes/random` has no `offset`, so only its `limit` gets a message.
- `utils/validation/remove-duplicate-categories`: the sanitizer function, with its test; it leaves a
  non-array untouched.
- `utils/seed/import-quote-row`: the author cut uses `QUOTE_AUTHOR_MAX_LENGTH`.
- `tests/utils/run-validators`: run the chains one after another, as Express does, because the
  duplicate sanitizer must see the trimmed items.
- Tests for each case: numeric text and author, bad lengths, bad categories, duplicates (including
  names that differ only by spaces), empty `PATCH`, random limit and offset messages.
- Docs: `README.md` (field rules and the empty `PATCH`), `ai/map.md` (`utils/validation/`).
  `ai/rules/api.md` already says what holds, so no change.

## Verification

- `npm run lint`, `npm run format:check`, `npm test`.
- Manual API check: every validation failure of `POST`/`PATCH /quotes` and `GET /quotes/random` by
  curl. With Docker, a throwaway Postgres (`quotes-pg-my-225`, port 55225) and the app on port 4225;
  `categories: ["life","life"]` must answer 201 with one category. Without Docker the app is started
  without the database and the duplicate path is covered by tests only.
