# Every shared module is imported through a folder barrel

Date: 2026-11-06 · Status: accepted

## Context

Most aliases in `package.json#imports` target a folder `index.js` (`#services/*`, `#utils/*`, ...), but
`#config/*`, `#constants/*` and `#models/*` targeted single files and `#error-classes/*` targeted
`*.error.js` files. Two import styles meant two rules to remember, and `#error-classes/*` duplicated
the existing `src/errors/classes/index.js` barrel.

## Decision

- One pattern: a shared module is reached through a folder `index.js`. `#config`, `#constants` and
  `#models` are exact aliases to their barrels; error classes come from `#errors/classes`;
  `#error-classes/*` is gone. `#database` and `#logger` stay exact aliases to one module.
- A barrel line follows the Todo decision `barrels-export-star`: a module with up to four names is
  listed, above four it is `export *`; two modules re-exported with `*` never export the same name.
- `models/index.js` imports `associations.js` first, so the associations are set wherever a model is
  used; a bare `import '#models'` is the side-effect import for startup, sync and seed scripts.
- Inside a barrel folder, siblings import each other relatively, never through the barrel (cycle).
- `QUOTE_CATEGORY_INCLUDE` moved from `constants/` to the quote query builder: constants must not
  import a model, otherwise every file that imports a constant loads Sequelize.

## Consequences

- `import { Quote } from '#models'`, `import { ERROR_MESSAGE } from '#constants'`,
  `import { NotFoundError } from '#errors/classes'`; tests mock `#models` instead of one model file.
- A new constant file, model or error class is added to its barrel in the same change.
- Rejected: keeping per-file aliases for these folders (a second import style for no gain).
