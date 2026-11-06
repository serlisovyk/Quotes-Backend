# Style Rules

Prettier decides the formatting (`npm run format`); these are the rules it does not. They follow the
author's code style standard plus this project's naming.

## General

- **No comments in code**, in JavaScript and in the root configs. Names and small functions say what
  the code does; a durable "why" goes to a rule, `ai/map.md` or a decision record.
- JavaScript ESM only.
- Early `return` instead of nested `if` / `else`; no nested ternaries.
- **A clean `return`:** a name, a literal, one call or a boolean of names. A `reduce`, a `map`, a
  comparison or a ternary is computed into a `const` first:

  ```js
  const ids = pageQuotes.map((quote) => quote.id)
  const hasCategory = Boolean(category)

  return { ids, hasCategory }
  ```

- **Named conditions:** a long condition becomes named `const`s or early returns, one idea per line.
- Booleans start with `is`, `has`, `can` or `should` (`isDeleted`, `hasCategory`).
- No magic numbers or strings: shared values come from `constants/`.
- Repeated scaffolding (a `try` / `catch` around every call) goes into one helper.
- **Blank lines group steps** (read, compute, write). A multi-line statement is its own paragraph.
  A guard is its own paragraph: the `if`, together with a `const` made only for it
  (`const isDeleted = …` + `if (!isDeleted) throw …`). When the checked value is used further on
  (`const quote = …` + `if (!quote) throw …`), a blank line separates the `if` from it. A guard
  block of one or two lines has no blank line inside.
- A destructuring statement is its own paragraph, before the code that uses it.
- Destructure in callbacks (`({ id, name }) =>`), not a repeated `item.id`.
- Parameter names say what they are (`quoteId`, `categoryNames`), not a bare `x` or `data`.
- **Functions:** a top-level function that is exported or longer than one line is a function
  declaration; an arrow function is for a short callback or a small local helper. An arrow whose body
  is one expression is written in the concise form when it fits the print width.

## Files, names and imports

- Files and folders are kebab-case. A file carries its role as a suffix: `.controller.js`,
  `.service.js`, `.router.js`, `.middleware.js`, `.validator.js`, `.util.js`, `.constant.js`,
  `.error.js`, `.factory.js`, `.seed.js`, `.model.js`, `.hook.js`, `.test.js`.
- Names in code: classes PascalCase (`AppError`, `Logger`), functions camelCase verbs, shared
  constants `UPPER_SNAKE_CASE`, and the keys of a shared constant object uppercase too
  (`ERROR_CODE.VALIDATION_ERROR`, `ROUTE.QUOTES`).
- A file holds one responsibility: a constant goes to `constants/`, in the file of its domain, a
  reusable helper to its own module in `utils/`.
- A folder has an `index.js` that re-exports its modules, so an import targets the folder. This holds
  for every shared module: config, constants, models and error classes included, however small
  (decision `folder-barrels-for-aliases`). A barrel line re-exports one module: up to four names it
  lists them, above four it is `export *` (decision `barrels-export-star` of the Todo reference);
  two modules re-exported with `*` must not export the same name.
- Shared internal modules are imported through the `#` aliases of `package.json#imports`, each
  pointing at a folder `index.js` or one named module (`#controllers/quotes`, `#constants`,
  `#models`, `#errors/classes`), never through a deep relative path, and without `/index.js`. A file
  beside the importer is imported relatively (`./bad-request.error.js`); a module inside a barrel
  folder never imports through that folder's own barrel (`constants/` files import each other
  relatively).
- **Import order**:** packages, then `#` aliases with `#constants` last, then `./` siblings. When only
  an import path changes, the existing order stays.
