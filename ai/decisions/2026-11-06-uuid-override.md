# `uuid` is overridden for Sequelize

Date: 2026-11-06 · Status: accepted

## Context

`npm audit --omit=dev` flagged `uuid < 11.1.1` (moderate), pulled in by `sequelize@6.37.8`, which
asks for `uuid ^8.3.2`. The only fix `npm audit` offers is downgrading `sequelize` to 3.30, which is
wrong.

## Decision

- `package.json` has `overrides: { "uuid": "^11.1.1" }`. Sequelize only calls `require('uuid').v1`
  and `.v4`, which uuid 11 still exports through its CommonJS build; tests and a server start pass.
- Not done: downgrading `sequelize`, and `npm audit fix --force`.

## Consequences

- The override is dropped once Sequelize itself depends on a fixed `uuid` (a v6 patch or v7).
- Dev-only advisories (`minimatch` via ESLint and nodemon) are not covered here;
  `npm audit --omit=dev` is the gate.
