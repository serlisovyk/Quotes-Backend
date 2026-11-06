# Plan: seed scripts and the Docker image (MY-227)

Branch `my-227-seed-docker`. Linear issue MY-227, milestone Рефакторинг. No API behavior changes, so
there is no spec.

## Author's answers (2026-11-06)

- The seed script calls the categories service itself; `import-quote-row` only parses and validates
  a row and does not import `#services`.
- The prod image keeps the seed scripts and the CSV. It excludes `.git`, `.github`, `.husky`,
  `.claude`, `ai`, tests (`**/*.test.js`, `src/tests`), `*.md` and linter configs.

## Changes

- `utils/seed/import-quote-row` becomes `utils/seed/parse-quote-row` (`git mv`): a pure function
  `parseQuoteRow(row)` that returns `{ text, author, categories }`, or `null` when the categories
  are invalid. No `#models`, no `#services`.
- `import-quotes.seed.js` — per row: `parseQuoteRow`, skip on `null`, `Quote.create`,
  `findOrCreateCategories` from `#services/categories`, `quote.addCategories`. The
  `ALLOW_SEED_RESET` guard, `CSV_IMPORT_BATCH_*` pauses and log messages stay as they are.
  `import.meta.dirname` replaces `fileURLToPath`.
- Both scripts: `finally { await closeDatabaseConnection() }`, so the process exits by itself, also
  after the `ALLOW_SEED_RESET` refusal.
- `.dockerignore` — the list from the author's answer; linter configs are `eslint.config.js`,
  `.prettierrc`, `.prettierignore`, `.lintstagedrc.json`; `vitest.config.js` and `jsconfig.json` are
  dev tooling and go too. `Dockerfile.dev` is not affected: the dev compose mounts the repo over
  `/app`.
- Docs: `src/database/seed/README.md` (scripts close the connection; the image keeps the seed
  scripts), `ai/map.md` (seed utils, Docker, `.dockerignore`).

## Tests

- `parse-quote-row.util.test.js` replaces the `import-quote-row` test: invalid categories → `null`,
  author cut at the comma and at 255 characters, categories split.
- Script tests (`*.seed.test.js` next to the scripts, mocked sequelize, models, services and
  `closeDatabaseConnection`): the connection is closed after success, after an error and after the
  `ALLOW_SEED_RESET` refusal, and `process.exitCode` is 1 on error.

## Verification

`npm run lint`, `npm run format:check`, `npm test`, `docker compose config`,
`docker compose -f docker-compose.dev.yml config`. With Docker: throwaway Postgres
`quotes-pg-my-227`, both seed scripts run to the end by themselves, `docker build` and a look at the
image filesystem. Without Docker (Desktop is not running): `node --check` on the scripts, the script
tests above, and the `.dockerignore` patterns applied to `git ls-files` to list the build context.
