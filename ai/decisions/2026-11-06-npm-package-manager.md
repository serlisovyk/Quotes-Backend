# npm is the package manager

Date: 2026-11-06 · Status: accepted

## Context

The repo needs one lockfile and one install command that every agent, the Docker builds and CI use
the same way. It already uses npm, commits `package-lock.json`, and its Dockerfiles run `npm ci`.

## Decision

- The package manager is `npm`; `package-lock.json` is the only lockfile and is committed.
- Installs are `npm ci` (from the lockfile) and `npm install` when a dependency changes; the lockfile
  is never edited by hand.
- A dependency change comes with the updated `package-lock.json` in the same commit.

## Consequences

- No `yarn.lock`, `pnpm-lock.yaml` or other tool's config; no package-manager shortcuts without an
  explicit request.
- Rejected: yarn and pnpm (a second tool is one more thing to keep in sync for a project this size).
