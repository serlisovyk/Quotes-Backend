# Docs Rules

Every task starts by reading the docs, so they stay short. The code is the source of **how**; docs
answer **where** (`ai/map.md`), **what must hold** (`ai/rules/`, `ai/skills/`) and **why**
(`ai/decisions/`).

- **One fact, one home.** Grep before adding a fact; link instead of copying. A doc does not retell
  the code (parameters, response shapes, constants, the endpoint list) or another doc. The map names
  where to look.
- **No history in current docs.** No task numbers, "since MY-…", measurements or check logs: they
  belong to commits, plans and reports. A rule says what holds now; a decision says why. The one
  exception is a short note on a change a later task will make (a planned setting): it may name that
  task (`MY-<n>`), and the task that lands the change deletes the note.
- **No other projects.** A doc never cites or compares with another of the author's projects; a rule
  or a decision stands on its own reasons.
- **Name folders, layers and functions, not file paths,** where that is enough: paths change, names
  last.
- **Update only what the change made wrong:** a file, folder, route, model, env variable, script or
  Docker file added, renamed or removed → the map; a pattern reshaped → the rule or skill; a durable
  decision → a record (criteria in `ai/decisions/README.md`); setup, scripts, env or the public API →
  `README.md`.
- **Links.** Relative, and kept working: a moved or renamed doc updates every link to it in the same
  change.
- **Language.** Everything in `ai/`, `AGENTS.md`, `CLAUDE.md` and `README.md` is English; Linear
  issues are Russian.
