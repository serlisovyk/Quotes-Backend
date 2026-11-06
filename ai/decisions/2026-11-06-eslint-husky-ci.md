# ESLint, a pre-commit hook and CI on every push

Date: 2026-11-06 · Status: accepted

## Context

Prettier was the only automatic check, and only when someone ran it. Unused variables, accidental
globals and layer violations were caught by review alone; tests and formatting ran neither before a
commit nor after a push. The author's project standard («ESLint, Husky и CI») sets one shape for all
repos; YourBank and Todo are the references.

## Decision

- ESLint flat config `eslint.config.js`: `@eslint/js` recommended, Node globals, `eslint-config-prettier`
  last. The tests import from `vitest`, so they need no extra globals.
- Architecture rules in the config (`no-restricted-imports`), so `ai/rules/` is checked, not only
  reviewed: routers do not import `#services/*`; services do not import `express` or
  `express-validator`; `src/constants/` does not import `#models`; no `../` imports (use a `#` alias).
  Unused arguments starting with `_` are allowed (Express needs the four-argument error middleware).
- Husky `pre-commit` runs `npx lint-staged`: ESLint `--fix` and Prettier on `*.js`, Prettier on
  `*.{json,md,yml}`. The hook is never bypassed with `--no-verify`.
- GitHub Actions `ci.yml` runs on every push (in practice `main`, the only branch pushed): Node 24,
  `npm ci`, `npm run lint`, `npm run format:check`, `npm test`, with `HUSKY: 0`.

## Consequences

- CI is a signal after the push, not a merge gate (decision `local-merge-without-pr`); a red `main`
  is fixed at once.
- Tests mock the database, so CI has no Postgres service.
- Rejected: pull request triggers (no pull requests here) and Dependabot (dependency updates are a
  planned task, not an automatic stream).
- A `group` pattern of `no-restricted-imports` follows gitignore rules, where a leading `#` starts a
  comment: the aliases are written `\\#services/*` in the config.
