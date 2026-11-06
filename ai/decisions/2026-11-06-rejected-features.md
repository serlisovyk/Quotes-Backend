# Features the author rejected

Date: 2026-11-06 · Status: accepted

## Context

The project is a small backend-practice one. The list in `ai/rules/scope.md` names what an agent must
not add on its own; this record keeps the reasons, so nobody "helpfully" restores one.

## Decision

Do not build or propose these again unless the author explicitly asks:

| Idea                                 | Why it was rejected                                             |
| ------------------------------------ | --------------------------------------------------------------- |
| TypeScript                           | JavaScript ESM is the project's language; a migration is churn  |
| A repository layer                   | Services use Sequelize directly; the extra layer hides the flow |
| Config validation                    | Out of proportion for a handful of variables                    |
| JWT or any authentication            | The API is public; no user model exists                         |
| Redis                                | Nothing to cache or queue at this size                          |
| GraphQL, tRPC, gRPC                  | REST is the API; a second protocol is out of proportion         |
| Swagger / OpenAPI                    | The public API is described in the README                       |
| Dependency injection containers      | Plain imports are easier for a learner to follow                |
| Metrics platforms, background jobs   | Out of proportion for a small service                           |
| Complex structured logging platforms | `Logger` wraps `console`, which is enough                       |

## Consequences

- Reviews and reports do not list these as missing.
- A task that seems to need one stops and asks first.
- Reversing any item needs an explicit request from the author and a new dated record.
