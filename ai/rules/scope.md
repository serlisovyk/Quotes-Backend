# Scope Rules

This is a small educational/backend-practice project. Keep the implementation useful without turning it into an enterprise template.

## Do Not Add Without Explicit Request

- TypeScript migration
- Config validation
- Repository layer
- JWT authentication
- Redis
- GraphQL
- tRPC
- gRPC
- Swagger/OpenAPI
- Dependency injection containers
- Metrics platforms
- Background jobs
- Complex structured logging platforms

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
- Keep Docker and seed behavior explicit because accidental database changes are expensive.
