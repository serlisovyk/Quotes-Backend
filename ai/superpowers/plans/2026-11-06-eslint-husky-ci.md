# Plan: ESLint, Husky, lint-staged and CI (MY-220)

Branch `my-220-eslint-husky-ci`. Linear issue MY-220, milestone Фундамент. No spec: API behavior
does not change.

## Goal

Add the automatic checks of the author's standard («ESLint, Husky и CI», YourBank as the
reference): ESLint with the architecture rules of `ai/rules/`, a pre-commit hook, and CI on every
push.

## Author's answers

- `no-restricted-imports` set: routers do not import `#services/*`; services do not import
  `express` or `express-validator`; `src/constants/` does not import `#models`; no deep relative
  `../` imports. Aliases since MY-218 are `#config`, `#constants`, `#models` (exact barrels),
  `#errors/classes`, plus the `*/index.js` patterns.

## Changes

- Dev dependencies: `eslint`, `@eslint/js`, `eslint-config-prettier`, `globals`, `husky`,
  `lint-staged`.
- `eslint.config.js` — flat config as in YourBank: ignores `.claude`; `js.configs.recommended`;
  `globals.node` for `src/` and the configs; Vitest globals for `*.test.js` only if the tests use
  them without importing; the architecture `no-restricted-imports` blocks per folder;
  `eslint-config-prettier` last.
- `package.json` scripts in the standard's order: `dev`, `start`, `lint`, `lint:fix`, `format`,
  `format:check`, `prepare` (`husky`), `test`, `test:watch`.
- `.husky/pre-commit` (`npx lint-staged`) and `.lintstagedrc.json` (`*.js`: `eslint --fix`,
  `prettier --write`; `*.{json,md,yml}`: `prettier --write`).
- `.github/workflows/ci.yml` — on push, `HUSKY: 0`, Node 24, `cache: npm`, `npm ci`, `npm run lint`,
  `npm run format:check`, `npm test`. No PR triggers, no Dependabot, no Postgres service (tests
  mock the database).
- `lint:fix` and the remaining fixes go in a separate commit and must not change behavior.
- Docs: `AGENTS.md` (Verification), `ai/workflow.md`, `ai/prompts/`, `ai/linear-task-template.md`,
  `README.md` (scripts, short CI section), `ai/map.md`, and a decision record on linters, hook and CI.

## Verification

- `npm run lint`, `npm run format:check`, `npm test`; tests keep their expectations.
- The hook is checked with a throwaway commit holding an ESLint error on a scratch branch.
- CI cannot run until `main` is pushed after merge; it is watched then.
- No endpoint changes, so no manual API check unless a lint fix touches a runtime path.
