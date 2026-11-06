# Docs Rules

How documentation in this repo is written and kept in sync. Entry point: [`AGENTS.md`](../../AGENTS.md). This file is about language, placement and upkeep.

## Language And Style

- Everything in `ai/`, `AGENTS.md`, `CLAUDE.md` and `README.md` is English. Linear issues are Russian.
- Short, concrete sentences. Link to the file that owns a fact instead of repeating it.
- Do not restate a rule in a second place. A rule lives in `ai/rules/`, the reason behind it in `ai/decisions/`, the location of a file in `ai/map.md`.
- Use relative links and keep them working; a moved or renamed doc updates every link to it in the same change.
- Dated files use `YYYY-MM-DD-<slug>.md`.

## Where Things Go

- `ai/rules/` - what to do now. Rewritten when practice changes.
- `ai/decisions/` - why it was decided, with a date. Only appended; a reversed decision gets a new record and the old one is marked `superseded by <file>`.
- `ai/map.md` - where things live. Updated in the same change that adds, renames or removes a file, route, model, env variable or script.
- `ai/skills/` - how to do typical work in this repo.
- `ai/superpowers/specs/` and `ai/superpowers/plans/` - one spec per change of API behavior, one plan per non-trivial task.
- `README.md` - what the project is, how to run it, the public API. Architecture details link to `ai/`, they are not copied.

## Upkeep

- Update docs in the same change as the code they describe, and only what the change made wrong.
- Do not add docs "just in case" or to describe the current diff; plans and specs are the place for task detail.
- Add a decision record as soon as a durable decision surfaces, without waiting to be asked.
- Do not copy lists from code into docs when the code is the source of truth (the full endpoint list is in `src/routes`, the error codes in `src/constants/errors.constant.js`); `ai/map.md` names where to look.
