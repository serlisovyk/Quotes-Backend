# Plan: quote and category limits (MY-330)

Branch `my-330-quote-limits`. Linear issue MY-330, milestone «Баги и безопасность». Spec:
`ai/superpowers/specs/2026-11-06-quote-limits.md`.

## Goal

Cap the categories per quote, the category name length and the quote text length; create the
categories of a quote sequentially instead of with `Promise.all`.

## Author's answers (2026-11-06)

- `MAX_CATEGORIES_PER_QUOTE = 10`, `CATEGORY_NAME_MAX_LENGTH = 50`.
- `QUOTE_TEXT_MAX_LENGTH` is not below the longest quote in `test-quotes.csv`, rounded up. Measured
  with `csv-parser`: the longest quote is 2468 characters, so the limit is `2500` (the longest
  category name in the file is 20, the most categories on a row is 8).
- `findOrCreateCategories` becomes a sequential `for ... of` loop of `Category.findOrCreate` in the
  same transaction; no `bulkCreate`. Same order, same returned instances.

## Changes

- `constants/validation.constant.js`: the three limits.
- `constants/errors.constant.js`: `INVALID_QUOTE_TEXT` and `INVALID_QUOTE_CATEGORIES` rewritten with
  the ranges, one new `CATEGORY_NAME_TOO_LONG`, all built from the constants, in one compact block.
- `validators/shared`: `categoryNameValidator` and `categorySearchValidator` get a max-length check,
  so `?category=`, `?name=` and the body items share it.
- `validators/quote`: `text` max length; the item chain gets the max length from the shared rule;
  the categories chain is `isArray({ min: 1 })`, `bail`, the duplicate sanitizer, then
  `isArray({ max })`, so the count is checked after repeats are removed (the item chain still runs
  before the array chain, so items are trimmed first).
- `services/categories`: sequential `findOrCreateCategories`.
- `utils/seed/parse-quote-row`: text cut to the limit, as the author is cut.
  `utils/seed/validate-and-split-categories`: more than 10 names keep the first 10; a name over 50
  characters makes the row skipped, like the other invalid names.
- Tests: each limit in the quote, shared and category validators (at the limit passes, one over
  fails), the order and sequential calls of `findOrCreateCategories`, the seed utils.
- Docs: `README.md` field rules; `ai/map.md` has nothing to change.

## Verification

- `npm run lint`, `npm run format:check`, `npm test`.
- Manual: with Docker, a throwaway Postgres (`quotes-pg-my-330`, port 55330) and the app on port
  4330, including a quote with new and existing categories. Without Docker, the app is imported
  without the database and the 400 cases are called by curl; the category creation is covered by the
  service tests only.
