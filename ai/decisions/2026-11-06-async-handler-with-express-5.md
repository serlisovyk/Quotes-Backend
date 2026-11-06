# asyncHandler stays with Express 5

Date: 2026-11-06 · Status: accepted

## Context

Express 5 forwards a rejected promise from a route handler to the error middleware by itself, so
`asyncHandler` is no longer needed for that. The routers, the API rules and the middleware tests
already rely on it.

## Decision

- `asyncHandler` (`middlewares/async-handler`) stays around every async controller in the routers
  (`ai/rules/api.md`).
- Controllers keep no `try/catch` of their own.

## Consequences

- One visible, tested place hands async errors to `next`, whatever the Express version.
- Rejected: removing it (it touches every route for no change in behavior). Dropping it later needs
  a new record that supersedes this one.
