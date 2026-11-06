# Plan: list response format (MY-228)

Branch `my-228-categories-pagination`. Linear issue MY-228, milestone «Рефакторинг». Spec:
`ai/superpowers/specs/2026-11-06-categories-pagination.md`.

## Goal

`GET /categories` answers `{ total, categories }`, like `GET /quotes` answers `{ total, quotes }`.

## Author's answers

- Format: `{ total, categories }` by the example of `/quotes`; `/quotes` does not change. A generic
  `{ total, items }` is rejected because it would change `/quotes` too.
- The backend part is done now, without waiting for the frontend Foundation (MY-221). The frontend
  never calls `/categories`, so the contract change breaks nothing deployed.
- The frontend part (`_services`, its README) is not in this branch; the issue stays In Progress
  until it is done.

## Changes

- `services/categories`: `findCategories` uses `Category.findAndCountAll` and returns
  `{ total, categories }`. `buildCategoryListQuery` has no `include`, so the count cannot be
  inflated and `distinct` is not needed.
- `controllers/categories`: `getCategories` answers the service result through `sendOk`, as
  `getQuotes` does.
- Tests: service (`findAndCountAll`, the shape, an empty result), controller and router updated to
  the new shape.
- Docs: `README.md` (response of `GET /categories`), `ai/map.md` (endpoints table),
  `ai/rules/api.md` ("Responses": an empty list is `total: 0` and an empty array), a decision record
  `ai/decisions/2026-11-06-list-response-format.md` indexed in `ai/decisions/README.md`.

## Verification

- `npm run lint`, `npm run format:check`, `npm test`.
- Manual API check on a throwaway Postgres when Docker is up: `/categories`, `limit` and `offset`,
  `name`, an empty result, and `/quotes` to confirm it is unchanged.
