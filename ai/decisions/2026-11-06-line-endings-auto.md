# Line endings: Prettier `endOfLine: auto`, no `.gitattributes`

Date: 2026-11-06 · Status: accepted (not implemented)

## Context

On Windows git checks files out as CRLF (`core.autocrlf`), while Linux CI sees LF. `.prettierrc` has
`endOfLine: "lf"`, which makes `npm run format:check` fail on every file of a Windows checkout.

## Decision

- `.prettierrc` sets `endOfLine: "auto"`: Prettier keeps the endings a file already has, so the check
  passes on a CRLF checkout and on an LF one.
- No `.gitattributes`; git's own `core.autocrlf` stays each machine's setting.

## Consequences

- Built by MY-218, which changes `.prettierrc` and sets this record to `accepted`. Until then, when
  `format:check` fails on CRLF, run `npx prettier . --check --end-of-line auto`.
- Prettier does not normalise endings, so a mixed-ending file passes; the repository holds LF (git
  converts on commit), so nothing mixed reaches `main`.
- Rejected: `.gitattributes` with `* text=auto eol=lf` (one more file to keep, and it rewrites every
  working copy to fix a check that `auto` already makes pass).
