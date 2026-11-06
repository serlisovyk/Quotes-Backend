---
name: endpoint
description: Use when adding or changing an API endpoint in the Quotes backend — which layer owns what, in which order, with its tests and docs.
---

# Endpoint

## When to use

Adding or changing anything a client of the API sees: a route, a query parameter, a body field, a
status code, an error.

## Steps

1. Read `ai/map.md` and the rules (`architecture`, `api`, `style`, `testing`); do not rediscover the
   code. A change of API behavior needs a spec before the code (`ai/workflow.md`, step 5).
2. Go through the layers in this order; a layer never reaches past its neighbor:
   - **Constants** — the path in `ROUTE` / `ROUTER_PATH`, limits and regexes, the `ERROR_CODE` and
     `ERROR_MESSAGE` entries (a message that needs a value is a function).
   - **Validator** — Express Validator chains in `validators/<resource>`; reuse `validators/shared`;
     `.toInt()` for numbers; messages from the constants.
   - **Route** — `routes/<resource>/<resource>.router.js`: the path constant, the validators,
     `validationErrorHandler`, `asyncHandler(controller)`, in that order. A new router is mounted
     explicitly in `app.js`.
   - **Controller** — read the validated values, apply the defaults from the constants, call one
     service, throw `NotFoundError` for a missing row, answer with `sendOk`, `sendCreated` (with the
     `Location`) or `sendNoContent`. No `try/catch`, no Sequelize.
   - **Service** — the logic and the model calls; a `sequelize.transaction` when several writes
     belong together. No request parsing or validation.
   - **Query builder** — every non-trivial `where`, `include`, `order` or `attributes` in
     `utils/query-builders`; shared options come from `constants/query-options.constant.js`.
   - **Tests** — next to each changed module (`ai/rules/testing.md`): validator, router (Supertest
     through `createRouterTestClient`, success and error cases), controller, service with mocked
     models and transactions, query builder.
3. A new folder that holds a module and its test gets an `index.js` with its first file; layer
   folders already have their `#` alias.
4. Verify per `ai/rules/definition-of-done.md`: call the endpoint by hand ("Manual API check" in
   `AGENTS.md`): the happy path, a validation failure (`400`, `VALIDATION_ERROR`, `fields`), invalid
   JSON, a missing row (`404`) and an unknown route.

## Recipes

**A query parameter on a list** — a validator in the resource's chain (shared one if two resources use
it), the controller passes it to the service, the query builder turns it into a `where`; the list
answer keeps the shape in `ai/rules/api.md`.

**A body field on a quote** — the validators for create (required) and update (`optional`), the
controller destructures it, the service writes it inside the transaction, the model gets the column;
tables are created by `sequelize.sync()`, so an existing database needs the author's decision before
a column appears (`ai/map.md`, "Database").

**A new error** — a code in `ERROR_CODE` and a message in `ERROR_MESSAGE`, an `AppError` subclass in
`errors/classes/` with its test; the factory needs no change for an `AppError`.

**A seed helper** — a function in `utils/seed/` with a test; the script in `database/seed/scripts/`
only wires helpers and stays behind its guard.

## Pitfalls

- Validation in a service, or a service called straight from a router.
- A repeated error string instead of an `ERROR_MESSAGE` entry.
- A list endpoint that answers an error for an empty result.
- A change to the quote queries that loses the `afterFind` hook's `categories` array of names.
