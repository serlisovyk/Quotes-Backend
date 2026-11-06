# Plan: sorting and general search of quotes (MY-335)

Branch `my-335-sort-search`. Linear issue MY-335, milestone «Доработки бэкенда». Spec:
`ai/superpowers/specs/2026-11-06-sort-search.md`. Blocker MY-330 is Done.

## Goal

`sort`, `order` and `search` for `GET /quotes`, with a stable secondary order by `id`.

## Author's answers (from the task brief)

- `sort` is `id | author | createdAt`, default `id`; `order` is `asc | desc`, default `asc`;
  secondary order by `id`.
- `search` is a case-insensitive substring over `text` OR `author` through `escapeLikePattern`, ANDed with
  `author`, `text` and `category`.
- The category filter refetches the page by ids; that refetch keeps the requested order.

## Changes

- `constants/validation.constant.js`: `QUOTE_SORT_FIELDS`, `SORT_ORDERS`, `QUOTE_SEARCH_MAX_LENGTH`
  (`100`). `constants/app.constant.js`: `DEFAULT_QUOTE_SORT`, `DEFAULT_SORT_ORDER`.
  `constants/query-options.constant.js`: `SORT_DIRECTION` (`asc` to `ASC`, `desc` to `DESC`) and
  `QUOTE_TIEBREAKER_ORDER` (`['id', 'ASC']`). `constants/errors.constant.js`: three messages.
- `validators/shared`: `sortOrderQueryValidator` (reusable by other lists).
  `validators/quote`: `sort`, `order`, `search` in `getQuotesValidators`.
- `utils/query-builders/query-filter-builder`: `buildAnyLikeFilter(fields, value)`, an `Op.or` of
  `buildLikeFilters` conditions, empty for an empty value.
- `utils/query-builders/quote-query-builder`: `buildQuoteOrder({ sort, order })`;
  `buildQuoteWhere` takes `search`; `buildQuoteListQuery` and `buildQuotesByIdsQuery` take sort and order,
  so the refetch by ids keeps the page order.
- The page query selects only the sortable columns (`QUOTE_SORT_FIELDS`): with the category include
  and a limit Sequelize wraps the page in a subquery and repeats `ORDER BY` outside it, so an
  unselected `createdAt` would fail in PostgreSQL. `findQuotes` therefore always refetches the page
  by ids (it did so only for a `category` filter before), in the same order.
- `services/quotes` `findQuotes` and `controllers/quotes` `getQuotes` pass `sort`, `order`, `search`; the
  controller applies the defaults, as it does for `limit` and `offset`.
- Tests: validators (values, defaults untouched, rejections, `search` length), filter builder, quote
  builder (order with and without tiebreaker, `search` in where, by-ids order), service (sort passed to the
  list query and to the by-ids refetch), controller, router (valid and invalid query).
- Docs: `README.md` parameters table; `ai/map.md` endpoints row.

## Verification

- `npm run lint`, `npm run format:check`, `npm test`.
- Manual: a throwaway Postgres (`quotes-pg-my-335`, port 55335) and the app on port 4335: sorts in
  both directions, `search` in text and in author, `search` with `%`, `search` plus `category`, `author` and `text`,
  pagination with sort, `total`, and the 400 cases. Without Docker, only the 400 cases are called
  and the rest is covered by the builder and service tests.
