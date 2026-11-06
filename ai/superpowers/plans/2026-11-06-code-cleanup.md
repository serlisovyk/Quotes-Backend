# Plan: code cleanup against the style rules (MY-226)

Branch `my-226-code-cleanup`. Linear issue MY-226, milestone Рефакторинг. No spec: the API behavior
does not change, tests stay green with unchanged expectations (only a describe name changes).

## Author's answers (2026-11-06)

- Import order across `src/` follows `ai/rules/style.md`: packages, `#` aliases with `#constants`
  last, `./` siblings. The "when only an import path changes, the existing order stays" caveat is
  removed from the rule once the code is aligned.
- Remove every comment from `src/` and the root configs; a durable "why" goes to `ai/`.
- Item 3 (delete `errors/classes/index.js`) is cancelled: MY-218 made it the `#errors/classes`
  barrel.

## Already done on `main`

- Item 1: `QUOTE_CATEGORY_INCLUDE` lives in `quote-query-builder.util.js`; `constants/` imports no
  model (MY-218).
- Item 2: `models/hooks/index.js` re-exports `./quote.hook.js` relatively (MY-218).

Both are verified, not redone.

## Changes

- Import order: every file under `src/` is reordered by a throwaway script (stable inside a group,
  only the leading import block). Not touched in this branch, to keep the rebase on MY-227 trivial:
  `src/database/seed/scripts/*.seed.js` and `src/utils/seed/import-quote-row/**`; they are aligned
  after MY-227 lands.
- ESLint enforcement: the built-in `sort-imports` sorts by member syntax and names, it cannot group
  `#constants` last. No built-in rule fits, and a plugin (`eslint-plugin-import`) is not worth adding
  for this; the order stays a reviewed rule.
- Comments: the two comment lines in `quote-category.model.js` are removed; the fact they stated
  (Sequelize creates `QuoteId` and `CategoryId` for the join model) goes to `ai/map.md`.
- Style pass over `src/` by `ai/rules/style.md`: guards as paragraphs, named conditions, clean
  `return`, blank lines; `getQuoteById`, `deleteQuoteById` and `patchQuoteById` throw the 404 in a
  block like `getCategoryById`; callbacks destructure; parameter names say what they are.
- `format-validation-errors.util.test.js`: describe name `FormatValidationErrors Util`.
- Docs: drop the caveat from `style.md`; `ai/map.md` gets the join-model note.

## Verification

`npm run lint`, `npm run format:check`, `npm test`. Manual check with no database when Docker is not
running: import `src/app.js`, listen on port 4226, curl `/health`, an unknown route (404), a
validation error (400) and invalid JSON (400).
