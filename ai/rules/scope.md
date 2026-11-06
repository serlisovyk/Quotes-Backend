# Scope Rules

This is a small backend-practice project. Improve it without turning it into an enterprise
template.

## Do Not Add Without Explicit Request

- TypeScript
- Config validation
- A repository layer
- JWT or any other authentication
- Redis
- GraphQL, tRPC, gRPC
- Swagger / OpenAPI
- Dependency injection containers
- Metrics platforms
- Background jobs
- Complex structured logging platforms
- Database migrations (Umzug, sequelize-cli)

Why each is out: decision `rejected-features`.

## Dependencies

- Runtime dependencies are `express`, `cors`, `helmet`, `express-rate-limit`, `express-validator`,
  `sequelize`, `pg`, `pg-hstore` and `csv-parser` (the seed import). Another one needs the
  author's explicit yes and a decision record. `.env` and file watching are Node's own flags, not
  packages (`node-watch-and-env-file`).
- Tooling in scope: Prettier, Vitest, Supertest, Docker and Docker Compose.

## Prefer

- Small incremental refactors
- Clear folder boundaries
- Simple Express patterns
- Practical request validation
- Centralized errors
- Direct, maintainable Sequelize queries
- Focused utility functions with tests when behavior is non-trivial

## Tradeoffs

- If a feature is unused, do not implement it just in case.
- If an abstraction hides more than it clarifies, do not add it.
- If a change makes the project harder for a backend learner to understand, reconsider the design.
- Keep Docker and seed behavior explicit: accidental database changes are expensive.
