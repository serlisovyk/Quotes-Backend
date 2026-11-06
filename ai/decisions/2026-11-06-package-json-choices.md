# package.json: `engines` yes, `packageManager`, `main` and `license` no

Date: 2026-11-06 · Status: accepted

## Context

`package.json` follows the author's standard and mirrors Quotes-Frontend, which records its own choices
in `package-json-choices`. The backend needs the same field set where the reason is the same.

## Decision

- `engines.node` is `>=24`, right after `type` and before `imports`, as in the frontend.
- No `packageManager` field: npm is fixed by `npm-package-manager`, and the field would only add a
  version to keep in sync.
- No `main` field (author's decision): `npm start` runs `src/main.js`, and the app is not a library.
- No `license` field: the repo has no license today.

## Consequences

- `Dockerfile` and `Dockerfile.dev` stay on `node:20-alpine`, which contradicts `engines` until MY-222
  moves them to Node 24.
- Rejected: `packageManager` (see above).
