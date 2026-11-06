# Task Workflow

End-to-end sequence for taking a Linear task in this repo. `AGENTS.md` states the non-negotiable
rules; this file is the full flow.

## 1. Pick up the task

- Read the Linear issue (`MY-<n>`) in full, including its «Порядок» section, its checklists, its
  «Решения автора» section and its "blocked by" relations. Do not start a task whose blockers are not
  `Done`.
- Check `ai/decisions/` for anything the task would contradict — especially the ideas
  `ai/rules/scope.md` names as out. If it reverses a decision, say so before starting.
- If the scope is ambiguous or conflicts with a rule or decision record, ask **before** writing
  anything, and put every question in a plain chat message too, not only in a question tool: a
  restart of the session loses what only the tool showed.

## 2. Branch

- Branch off the latest `main`, named `my-<n>-<slug>` (e.g. `my-<n>-quote-validation`) — lowercase
  issue id, short English slug.
- Do not use Linear's `gitBranchName` as-is: it prepends a username and its slug is a transliteration
  of the Russian title. Write your own short English slug.
- Never commit task work directly on `main`.
- Several tasks at once: one `git worktree` per branch, see "Parallel work" below.

## 3. Move the task to In Progress

Set the Linear issue state to `In Progress` when work actually starts — not when it is merely
planned.

## 4. Orient

Read in this order, stopping once you have what the task needs:

1. `ai/map.md` — where things live and what the project deliberately lacks.
2. The `ai/rules/*` of the area you touch, and the decision records of what you touch (index in
   `ai/decisions/README.md`).
3. The matching skill in `ai/skills/` — `endpoint` for anything a client of the API sees.

Do not explore the code from scratch when the map answers the question. `ai/superpowers/` is the
archive of past tasks: read only the plan or spec of the feature you change.

## 5. Spec + plan — one commit, before code

- **Plan** — for anything touching more than one or two files, or with more than one reasonable
  approach. Say what will change and how it will be verified; cite decision records, do not retell
  them (`ai/rules/docs.md`).
- **Spec** — when the task changes observable API behavior (a request or response shape, status
  codes, validation, the error shape).
- Write them under `ai/superpowers/plans/` and `ai/superpowers/specs/` as `<YYYY-MM-DD>-<slug>.md`,
  reusing the branch slug so spec, plan, branch, and issue pair up.
- Commit spec + plan together as a **single commit**, before any implementation commit.
- If the issue says something is to be "decided in the plan" (`решить в плане`), stop after the plan
  commit and hand the plan to the author. Continue only after approval, updating the plan with the
  author's answers.
- A trivial, single-file, single-approach change does not need a plan file — use judgment, don't
  manufacture ceremony.

## 6. Implement

- Follow the plan; commit in logical units, not one giant snapshot. Inspect `git status` and
  `git diff` before each commit.
- The pre-commit hook (Husky + lint-staged: ESLint and Prettier on the staged files) is never
  bypassed with `--no-verify`; fix what it reports.
- Conventional Commit messages in English (`feat:`, `fix:`, `refactor:`, `docs:`, `style:`, `test:`,
  `build:`, `ci:`, `chore:`) — specific, never `update` or `changes`.
- Use the matching skill instead of improvising a pattern that already exists.
- If reality diverges from the plan, update the plan file in the same change.

## 7. Keep docs in the same change

Only what the change made wrong, as `ai/rules/docs.md` says:

- `README.md` — when setup, scripts, env or the public API changed.
- `ai/map.md` — when a file, folder, route, model, env variable, script or Docker file was added,
  removed, renamed, or moved.
- `ai/rules/*` or `ai/skills/*` — when the change reshaped a pattern.
- `ai/decisions/` — a new dated record when the change meets the criteria in its `README.md`.

## 8. Verify

- The checks in `AGENTS.md` (Verification), tests included.
- Call every affected endpoint against a running server, error cases included ("Manual API check" in
  `AGENTS.md`). Green tests do not prove an endpoint works.
- For a change to Docker, compose, a port or an env variable, also run `docker compose config` and
  `docker compose -f docker-compose.dev.yml config`.

## 9. Definition of Done gate

Walk `ai/rules/definition-of-done.md` point by point. Fix what fails before moving on.

## 10. Self-review

Run the `review` skill over the diff, then read the whole `git diff main..HEAD` line by line against
`ai/rules/style.md`, `ai/rules/architecture.md`, `ai/rules/api.md` and `ai/rules/testing.md`. A
subagent does both before it reports; the orchestrator reads the diff again before the author sees
the branch. Fix what you find, or state plainly why a finding is being left alone.

## 11. Author approval — required stop

Nothing is merged and nothing is marked done without the author's explicit approval. Hand over the
report (step 12) and stop — silence or a neutral reply is not a yes. «Продолжай» ("carry on") is a
neutral reply, not an approval; an approval names the branch, and a yes to one branch does not cover
the next. Requested changes go back through steps 6–10; fold a small fix into the commit that
introduced it (`--fixup` + autosquash) rather than always adding a new commit.

## 12. Report

In Russian (it is chat, not a file):

- **what was done** — plain language, point by point, readable without opening the diff or the plan;
- branch (and worktree path, if any) and the commit list;
- verification output and which endpoints were called by hand, with what result;
- self-review findings and what was done about each;
- anything deliberately left out of scope.

## 13. Merge — locally, no pull request

After approval:

```bash
git switch main
git pull --ff-only
git switch my-<n>-<slug>
git rebase main            # re-run the checks if the rebase brought in new commits
git switch main
git merge --ff-only my-<n>-<slug>
npm run lint && npm run format:check && npm test
git push origin main
git branch -d my-<n>-<slug>
```

- The feature branch is never pushed: only `main` is (decision `local-merge-without-pr`).
- After a rebase that brings in another branch's work, call the affected endpoints on the combined
  result too: a change in one branch can break an endpoint of the other.
- After the push, wait for CI on `main` (lint, format check, tests) to go green, polling a few minutes apart
  (the unauthenticated GitHub API allows 60 requests an hour); a red `main` is fixed right away with
  a follow-up commit.
- If `main` deploys on the push, check the live service read-only (call it) and never touch the
  hosting project.
- History stays linear: rebase onto `main`, then fast-forward. Never force-push `main`.
- Remove the worktree if one was used (`git worktree remove <path>`).
- Move the Linear issue to `Done` only once the checks on `main` pass (and CI is green), and comment with the merged commit SHAs, the author's decisions, what was checked and what
  was not.

## Parallel work

- One task per worktree: `git worktree add .claude/worktrees/my-<n>-<slug> -b my-<n>-<slug> main`,
  then `npm ci` inside. In Claude Code, enter it with `EnterWorktree` (`path`).
- Run at most three tasks at a time: three when that many are unblocked and touch different parts of
  the code (different resources, layers or docs), otherwise two, one for a repo-wide task. The
  issue's «Порядок» section says what runs alongside it. Two tasks that change the same endpoint,
  model, constants file or error shape never run together.
- The files both tasks will still touch (usually `ai/map.md`, `ai/decisions/README.md`, `README.md`,
  `src/constants`) are named up front, in the brief of each, so the branch merged later expects the
  conflict.
- Each task that runs the server uses its own ports and its own throwaway Postgres container
  ("Manual API check" in `AGENTS.md`), never the author's, and stops them when done.
- A batch is run by the orchestrator (`ai/prompts/orchestrator.md`).
- Merge one branch at a time; every branch merged after the first rebases onto the updated `main`
  before its merge.
- Repo-wide changes (Prettier, ESLint, CI, `package.json`, file moves, the Фундамент milestone) run
  alone, never alongside other branches.
