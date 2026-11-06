# Plan: ESLint config in the frontend's format (MY-338)

Branch `my-338-eslint-config`. Linear issue MY-338. No spec: API behavior does not change.

## Goal

Bring `eslint.config.js` to the shape of the frontend's `eslint.config.mjs` without changing what the
rules do.

## Author's answers

- The config follows the same style as the frontend repo (final).

## Changes

- `eslint.config.js` only:
  - `defineConfig([...])` and `globalIgnores([...])` from `eslint/config`.
  - `js.configs.recommended` through `extends` in a `files` block instead of a bare array entry.
  - Named constants at the top for every message, folder glob and import group, as `FETCH_MESSAGE`
    does in the frontend.
  - One helper builds a `no-restricted-imports` rule and always adds the `../` group, so the group is
    no longer repeated by hand in every override (the options of a later block replace the earlier
    ones, so the shared part cannot be inherited).
  - Aliases in `group` keep the escaped form `'\\#services/*'`: a leading `#` is a gitignore comment.
  - No comments in the file (`ai/rules/style.md`).
- Rules do not change in effect: routers do not import `#services/*`, services do not import `express`
  or `express-validator`, `src/constants/` does not import `#models`, no `../` imports,
  `argsIgnorePattern: '^_'`, `globals.node`, `eslint-config-prettier` last.
- `package.json`: the `imports` field moves to the very end (author's decision), content unchanged, as a
  separate commit; a new decision record `imports-last-in-package-json` states the field order.
- Docs: the decision `eslint-husky-ci` and `ai/map.md` are checked and changed only if they became
  wrong.

## Verification

- `npm run lint` on the real code stays clean; `npm run format:check`; `npm test`.
- Temporary violating files, deleted afterwards, each must be reported: a router importing
  `#services/quotes`, a service importing `express` and `express-validator`, a constant importing
  `#models`, a `../` import, an unused non-underscore argument (an underscore one stays quiet).
