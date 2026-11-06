# package.json: `imports` goes last

Date: 2026-11-06 · Status: accepted

## Context

`package-json-choices` placed `engines` right after `type` and before `imports`. The author's standard
sets one field order for all repos; `imports` is Node-specific and has no place in it.

## Decision

- `imports` is the last field of `package.json`, after `devDependencies` and `overrides`: the standard's
  field order first, Node-specific subpath imports at the bottom. Its content is unchanged.
- Everything else in `package-json-choices` stays in force, except that `engines.node` is followed by
  `scripts`, not `imports`.
- `jsconfig.json` stays as it is.

## Consequences

- A new alias is added at the bottom of the file, in the `imports` block.
- Rejected: `imports` before `scripts` (the old position), which put an editor-facing detail between the
  package identity and the commands.
