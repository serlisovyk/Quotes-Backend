# The prod image is built from the Dockerfile, with scripts off

Date: 2026-11-06 · Status: accepted

## Context

`package.json` has `"prepare": "husky"`, and `husky` is a dev dependency. `npm ci --omit=dev` in the
`Dockerfile` ran `prepare` without `husky` installed and failed, so the prod image did not build;
CI only ran the code checks and did not notice. The prod compose file pulled an image from Docker
Hub that nobody published, so it would have run stale code anyway.

## Decision

- The `Dockerfile` installs with `npm ci --omit=dev --ignore-scripts`: the image needs no Git hooks,
  and no dependency of the API relies on an install script.
- `Dockerfile.dev` keeps plain `npm ci`: `husky` is installed there and exits 0 when the build
  context has no `.git`.
- `docker-compose.yml` builds the `server` service from the `Dockerfile` (`build: .`); nothing is
  published to Docker Hub.
- CI has a job that runs `docker build .` (no push) on every push, so a broken `Dockerfile` fails CI.

## Consequences

- `docker compose up` needs no registry; a code change reaches the prod-like stack with
  `docker compose up -d --build`.
- Rejected: `HUSKY=0` in the `Dockerfile` — it hides one script, not the cause, and `--ignore-scripts`
  also covers future install scripts of dev-only tooling.
- Rejected: publishing the image to Docker Hub from CI — the author does not want a registry.
- A dependency that needs its install script (a native build) must run it explicitly in the
  `Dockerfile`, e.g. `npm rebuild <package>`.
