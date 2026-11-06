# Plan: package.json and Prettier to the standard (MY-218)

Branch `my-218-package-prettier`. Linear issue MY-218, milestone Фундамент.

## Goal

Bring `package.json`, `.prettierrc`, `.prettierignore` and `jsconfig.json` to the author's standard
(documents «package.json» and «Prettier», YourBank as the reference), so `npm run format:check`
passes on a Windows (CRLF) checkout and on Linux. No spec: API behavior does not change. ESLint,
Husky and CI stay out (the next task).

## Author's answers

- Remove the `main` field: `start` runs `src/main.js`, the hosting finds `src/app.js` itself.

## Changes

- `.prettierrc` — the standard config, `endOfLine: "auto"`. `.prettierignore` — `node_modules` and
  `package-lock.json` (nothing else is generated in this repo).
- `package.json` — `description` becomes «REST API for a quotes app built with Express, Sequelize,
  PostgreSQL, and Docker.»; `main` removed; field order as the standard; `imports` per the alias item below;
  scripts in the standard's names and order (`dev`, `start`, `test`, `test:watch`, `format`,
  `format:check`); `format` and `format:check` in the standard's `prettier . --write/--check` form.
  `engines.node` is `>=24` (as Quotes-Frontend), right after `type`; no `keywords`, no `packageManager`
  (decision `package-json-choices`). No `license`: the standard leaves it to the project,
  and this repo has none today (YourBank's `license-in-package-json` record is its own choice).
- `jsconfig.json` — `paths` mirror `package.json#imports` exactly (the `.js` suffix on
  `#config/*`, `#constants/*`, `#models/*`).
- One alias pattern (author request): `#config`, `#constants` and `#models` are exact aliases to new folder
  barrels (`config/`, `constants/`, `database/models/` `index.js`; the models barrel loads `associations.js`);
  `#error-classes/*` is dropped for `#errors/classes`. Barrel lines follow Todo's `barrels-export-star`.
  `QUOTE_CATEGORY_INCLUDE` moves to the quote query builder, because constants must not import a model.
  Docs: `style.md`, `architecture.md`, `map.md`, decision `folder-barrels-for-aliases`.
- Strip the UTF-8 BOM from `src/database/seed/README.md` (the only file that still has one).
- Decision `line-endings-auto` becomes `accepted`; its index line loses "(not implemented yet)".
  The temporary "until MY-218" notes go from `AGENTS.md` (Verification), `ai/skills/review.md`; the
  MY-216 plan is an archive and stays as it was.
- `ai/map.md` — the scripts line and the Prettier line match the new files.
  `ai/workflow.md` and `ai/prompts/` already name `format:check` only; checked, nothing to add (no
  lint script exists yet).

## Verification

- `npm run format:check` on this CRLF checkout (the old config failed on every file), `npm test`.
- Check `jsconfig.json` paths against `package.json#imports` with a short script.
- Linux side: LF files pass under `endOfLine: auto` as well (checked with
  `npx prettier . --check --end-of-line lf`).
- No endpoint changes, so no manual API check.
