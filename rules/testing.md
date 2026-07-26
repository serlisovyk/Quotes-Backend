# Testing Rules

## What To Test

- Controllers: response behavior and service/error interaction.
- Routes: validator/middleware wiring and HTTP behavior with Supertest.
- Services: application logic with mocked Sequelize models and transactions.
- Middlewares: error handling, async handling, validation handling, and request logging behavior when relevant.
- Error classes and factories: response shape, status codes, and normalization.
- Utilities: query builders, response helpers, database helpers, seed helpers, and non-trivial string/data transforms.
- Model hooks: transformation behavior that affects API responses.

## What Not To Test By Default

- Plain constants.
- `src/config/app.config.js` unless config behavior becomes more complex.
- Sequelize model definitions unless hooks, scopes, or custom model behavior are added.
- Logger output formatting unless the logger gains behavior beyond wrapping console methods.
- Destructive seed scripts directly; test their extracted utilities instead.

## Test Structure

- Keep tests close to the files they verify.
- If a folder contains a module and a test file, add an `index.js` re-export.
- Put shared mocks in `src/tests/mocks`.
- Put shared test-only utilities in `src/tests/utils`.
- Use aliases for imports when an alias exists.
- Prefer clear `describe` names with PascalCase-like labels, for example `Quotes Controller`.

## Mocking

- Mock database models, Sequelize transactions, and response objects instead of touching a real database.
- Keep mocks small and explicit.
- Reuse shared mocks only when they reduce meaningful repetition.
