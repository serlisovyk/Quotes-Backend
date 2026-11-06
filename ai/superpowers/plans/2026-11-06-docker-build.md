# Plan: the prod Docker image builds, and CI builds it (MY-328)

Branch `my-328-docker-build`. Linear issue MY-328, milestone «Баги и безопасность». No API behavior
changes, so there is no spec.

## Author's answers (2026-11-06)

- The prod compose builds the image from `Dockerfile`; nothing is published to Docker Hub.

## Findings

- `npm ci --omit=dev` fails with `command failed: husky`: `prepare` runs `husky`, a dev dependency
  that is not installed. Reproduced in a clean directory with only `package.json` and
  `package-lock.json`; with `--ignore-scripts` it succeeds and installs 104 packages, none of them
  `husky`, `vitest`, `eslint` or `prettier`.
- `Dockerfile.dev` runs `npm ci` with dev dependencies, so `husky` exists; in a directory without
  `.git` (the build context excludes it) it exits 0. `Dockerfile.dev` stays as it is.

## Changes

- `Dockerfile` — `npm ci --omit=dev --ignore-scripts`: the image needs no Git hooks.
- `docker-compose.yml` — the `server` service uses `build: .` instead of
  `image: serhii5105/quotes-server:latest`.
- `.github/workflows/ci.yml` — a second job, `docker`, runs `docker build .` (no push), so a broken
  `Dockerfile` fails the push. `HUSKY: 0` stays on the existing job.
- Docs: `ai/map.md` (Docker, CI), `README.md` (Docker: the prod compose builds the image, so
  `up -d --build`), a decision record `docker-build-from-dockerfile` and its index line.

## Verification

- `npm run lint`, `npm run format:check`, `npm test`.
- `docker compose config` and `docker compose -f docker-compose.dev.yml config`, with a temporary
  `.env` (deleted afterwards).
- `docker build` of the prod image under a throwaway tag, run against a throwaway Postgres
  (`quotes-pg-my-328`, port 55328, `APP_PORT=4328`); `/health` must answer 200; containers, network
  and image are removed afterwards.
- The CI job is proven by the first push to `main` after the merge.
