# Automated tests stay: Vitest and Supertest

Date: 2026-11-06 · Status: accepted

## Context

The backend has a Vitest suite, with Supertest for routes, covering controllers, routes, validators,
services, middlewares, errors and utilities. A backend has no screen to check a change on, so the
suite is the fast check of everything an endpoint does.

## Decision

- Tests are part of the work and of verification: `npm test` must pass, and a change of behavior
  comes with tests (`ai/rules/testing.md`).
- Tests mock models and transactions and never touch a real database. Calling the endpoints by hand
  is an additional check, not a replacement (`manual-api-check-throwaway-postgres`).

## Consequences

- A task that adds an endpoint or changes validation or errors is not done without tests.
- The task prompt has no "no tests" constraint, and the absence of a test for new behavior is a
  review finding.
- Rejected: dropping the suite (it covers the layers that have no other check).
