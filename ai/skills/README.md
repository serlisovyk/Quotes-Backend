# Skills

Repo-local skill playbooks. Tool-agnostic Markdown — any AI agent (Claude, Codex, others) reads them
directly. Each file has `name` + `description` frontmatter so it maps to a matching skill entry when
a tool supports one. A skill is a recipe; what must hold is in `ai/rules/`. The other docs are listed
in `AGENTS.md`.

- [endpoint](endpoint.md) — how an endpoint flows through constants, validator, route, controller,
  service, query builder and tests; recipes for a query parameter, a body field, an error and a seed
  helper.
- [review](review.md) — self-review of a diff: regressions, API contract, missing tests, scope creep,
  docs drift.
