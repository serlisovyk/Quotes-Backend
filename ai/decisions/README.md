# Decisions

Durable project decisions: why a choice was made, with a date. One decision per file, named
`YYYY-MM-DD-<slug>.md`. Format: a title, a `Date: … · Status: …` line, then `Context` →
`Decision` → `Consequences`; short and specific (about 30 lines), rejected alternatives with their
reason, no check logs.

How this differs from `ai/rules/`: **rules** state what to do now (current law, rewritten as it
changes). **Decisions** state _why_, with a date. A record's text is not rewritten or deleted; only
its `Status` line changes.

The point: an agent (or a human) does not relitigate settled questions or "helpfully" restore
something that was deliberately rejected.

## Status

- `accepted` — in force and built.
- `accepted (not implemented)` — agreed now, built by a later task; that task sets it to `accepted`.
- `superseded by <file>` — replaced by a newer record; its line in the index moves to the
  Superseded group.

## Changing a decision

A refinement or a reversal is a **new record** that restates what stays in force, so the reader needs
only the newest one. The old record only changes its `Status` line to `superseded by <file>`.

## When to add a record

Propose one as soon as the decision surfaces, without being asked, and only for:

- a standing constraint ("we will not do X", "always / never Y");
- a feature the author deliberately rejected — in a dated record that adds to `rejected-features`
  (a record is not rewritten);
- a tradeoff accepted over a named alternative, one a future agent would likely undo;
- a goal agreed now and built later (`accepted (not implemented)`);
- a convention chosen where an obvious alternative existed.

Not decisions: one-off task details, plain current-state facts, a choice nobody would reverse,
anything `ai/rules/` and `ai/map.md` already cover. Do not create noise records.

## Records

The records in force, by topic; a Superseded group is added when the first record is replaced, each
with the record that replaced it.

### Project and process

- [npm is the package manager](2026-11-06-npm-package-manager.md)
- [Automated tests stay: Vitest and Supertest](2026-11-06-tests-vitest-supertest.md)
- [Merge locally into `main`, no pull requests; only `main` is pushed](2026-11-06-local-merge-without-pr.md)
- [Manual API checks run on a throwaway Postgres container](2026-11-06-manual-api-check-throwaway-postgres.md)
- [Prettier `endOfLine: auto`, no `.gitattributes`](2026-11-06-line-endings-auto.md)
- [`package.json`: `engines` yes, `packageManager`, `main`, `license` no](2026-11-06-package-json-choices.md)
- [Features the author rejected](2026-11-06-rejected-features.md)

### Code structure and runtime

- [`asyncHandler` stays with Express 5](2026-11-06-async-handler-with-express-5.md)
- [`trust proxy` is a hop count](2026-11-06-trust-proxy-hop-count.md)
- [Every shared module is imported through a folder barrel](2026-11-06-folder-barrels-for-aliases.md)
