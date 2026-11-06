# Testing Rules

The project keeps an automated suite: Vitest with Supertest for routes (decision
`tests-vitest-supertest`). `npm test` runs it once; `npm run test:watch` watches. A change of behavior
comes with tests.

## What to test

- Controllers: the response, and how the service and the errors are used.
- Routes: validator and middleware wiring and the HTTP behavior, with Supertest.
- Validators: the chains accept and reject the right values.
- Services: the application logic, with mocked Sequelize models and transactions.
- Middlewares: error handling, async handling, validation handling and, where it matters, request
  logging.
- Error classes and the factory: response shape, status codes, normalization.
- Utilities: query builders, response helpers, database helpers, seed helpers and any non-trivial
  string or data transform.
- Model hooks: a transformation that reaches an API response.

## What not to test by default

- Plain constants.
- `config/app.config.js`, until it holds behavior.
- Model definitions, until they gain hooks, scopes or custom behavior.
- Logger output, while the logger only wraps `console`.
- Destructive seed scripts directly; test the helpers extracted from them.

## Structure

- A test sits next to the module it checks, named `<module>.test.js`; the folder has an `index.js`
  (`ai/rules/style.md`).
- Shared mocks live in `src/tests/mocks`, shared test-only helpers in `src/tests/utils`
  (`createRouterTestClient` for a router, `runValidators` for a validator chain).
- Imports use the `#` aliases wherever one exists.
- A `describe` label names the unit in PascalCase words: `Quotes Controller`.

## Mocking

- Mock models, Sequelize transactions and response objects; a test never touches a real database.
- Keep a mock small and explicit; share one through `src/tests/mocks` only when it removes real
  repetition.
- A test is changed only when the behavior it describes changed on purpose.
