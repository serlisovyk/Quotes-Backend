# Plan: AI workflow (MY-216)

Branch `my-216-ai-workflow`. Linear issue MY-216, milestone Фундамент.

## Goal

Give every agent one entry point (`AGENTS.md`) and the project docs in `ai/`, following the author's
«Стандарт проекта» and the author's reference projects, adapted to an Express
backend that keeps its tests. No spec: API behavior does not change. No source code, `package.json`,
Prettier, ESLint or CI changes.

## Files

- `AGENTS.md` — the project, what to read first, workflow rules that never bend, defaults, languages,
  verification with the manual API check. `CLAUDE.md` — `@AGENTS.md` plus a short orientation.
- `ai/map.md` — built from `src/`, `package.json`, the Dockerfiles, the compose files and
  `.env.sample`: layers, aliases, endpoints, database, seed scripts, environment, Docker, what the
  project does not have.
- `ai/workflow.md` — the 13 steps of the standard with `npm`, the manual API check, parallel work in
  worktrees (up to three tasks) and the local merge where only `main` is pushed.
- `ai/rules/` — the standard set `architecture.md`, `scope.md`, `style.md`, `docs.md`,
  `definition-of-done.md`, plus two files for this stack: `api.md` (validation, errors, responses) and
  `testing.md`. The old `rules/` is not kept as it was: its facts (layers, boundaries, the error
  shape, `AppError`, Sequelize in services, query builders, the `trust proxy` rule, the scope list)
  move into the new files; `validation-errors.md` and `verification.md` are gone (verification lives
  in `AGENTS.md` and the Definition of Done).
- `ai/decisions/` — `README.md` index and records: npm, tests stay, local merge without PRs, manual
  API checks on a throwaway Postgres, line endings (`accepted (not implemented)` until MY-218),
  rejected features, `asyncHandler` with Express 5, `trust proxy`.
- `ai/skills/` — `README.md`, `endpoint.md` (the role of `feature` in the references), `review.md`.
- `ai/prompts/` — `README.md`, `orchestrator.md`, `task.md` from the standard's templates with the
  project's values; no "no tests" constraint.
- `ai/linear-task-template.md` — the structure of the Quotes backend issues in Linear.
- `ai/superpowers/specs/README.md`; this plan opens `ai/superpowers/plans/`.
- `README.md` — Architecture Notes link to `ai/`. `.gitignore` — `.claude/worktrees/`.

## Approach

- Follow the shape and tone of the reference projects; where the Linear standard and the
  references differ, the references win.
- Code style comes from the author's «Стиль кода» document without the React, CSS and class parts,
  plus the project's own rules: `#` aliases, kebab-case names with role suffixes, folder `index.js`,
  uppercase constant keys. Code has no comments (existing comments leave in a later task).
- Docs have no size limits (the author's decision); the rest of `docs.md` follows the references: one
  fact one home, no history, no other projects.
- Manual API checks run on a throwaway Postgres container on its own port, described once in
  `AGENTS.md`; the compose files publish no Postgres port.
- `vercel.json` was removed from the repo; the `trust proxy` record states the rule and does not
  describe a deployment.
- Commits: plan; rules; map; workflow; decisions; skills; prompts and the Linear template; superpowers
  READMEs; entry points and README; `.gitignore`; then the rewrite of the rules and the docs to match
  the references.

## Verification

- `npm run format:check`; on this Windows checkout CRLF may fail every file, then
  `npx prettier . --check --end-of-line auto`.
- `npm test`.
- A script checks that every relative link between the docs resolves.
- Walk `ai/rules/definition-of-done.md`, then the `review` skill over the diff.
