# Style Rules

## General

- Use JavaScript ESM.
- Prefer readable code over clever code.
- Keep files focused on one responsibility.
- Prefer function declarations for exported or multi-line top-level functions.
- Use arrow functions for short callbacks and small local functions when they read better.
- Avoid unnecessary comments. Add comments only when they explain non-obvious reasoning.

## Imports

- Use native Node `package.json#imports` aliases with the `#` prefix for shared internal modules.
- Prefer `#controllers/quotes` over deep relative imports when an alias exists.
- Do not include `/index.js` in import paths when importing a module folder.
- Use relative imports for files that live directly beside each other.
- Preserve existing import ordering when only changing import paths.

## Naming

- Use kebab-case file and folder names.
- Use suffixes that describe the role: `.controller.js`, `.service.js`, `.router.js`, `.middleware.js`, `.validator.js`, `.util.js`, `.constant.js`, `.error.js`, `.factory.js`, `.seed.js`.
- Use `Logger` for application logs.
- Use `AppError` as the base operational error class.
- Use uppercase object keys for shared constants:

```js
ERROR_MESSAGE.INTERNAL_SERVER_ERROR
ERROR_CODE.VALIDATION_ERROR
ROUTE.QUOTES
```

## Folder Indexes

- Add `index.js` for folders that contain a module and its test file, so imports can target the folder.
- Do not create wrapper folders for simple constants or simple error classes that do not have their own test file.
- Keep constants as clear flat files unless grouping them materially improves navigation.

## Formatting

- Use Prettier.
- Use single quotes.
- Do not use semicolons.
- Keep `printWidth` at `85`.
- Use `npm run format` to apply formatting.
