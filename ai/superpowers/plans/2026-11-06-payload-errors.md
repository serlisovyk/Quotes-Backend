# Plan: 413 and 415 instead of 500 for body parser errors (MY-224)

Branch `my-224-payload-errors`. Linear issue MY-224, milestone Баги и безопасность. Spec:
`ai/superpowers/specs/2026-11-06-payload-errors.md`.

## Author's answers (2026-11-06)

- Besides `entity.too.large` → 413, answer 415 for `charset.unsupported` and `encoding.unsupported`.
- Do not handle `entity.verify.failed`: `verify` is not used.

## Changes

- `constants/app.constant.js` — `HTTP_STATUS.PAYLOAD_TOO_LARGE` (413) and
  `HTTP_STATUS.UNSUPPORTED_MEDIA_TYPE` (415).
- `constants/errors.constant.js` — `ERROR_CODE` and `ERROR_MESSAGE` entries `PAYLOAD_TOO_LARGE` and
  `UNSUPPORTED_MEDIA_TYPE`, added in one compact block per object (MY-225 edits the same file).
- `errors/classes/` — `PayloadTooLargeError` and `UnsupportedMediaTypeError`, both `extends AppError`,
  exported from the barrel; added to `http-errors.test.js`.
- `ErrorFactory` — a body-parser error is recognized by its `type` (`entity.too.large`;
  `charset.unsupported` and `encoding.unsupported` share one 415 error). `from` maps it, `shouldLog`
  returns `false` for it, so the middleware does not log it. Invalid JSON handling stays as it is.
- Tests: factory, error middleware, and a Supertest test over `src/app.js` (`src/app.test.js`): a
  body over the limit → 413, an unsupported charset → 415, invalid JSON → 400 `INVALID_JSON`.
- Docs: `README.md` Error Format lists the codes; `ai/skills/endpoint.md` and `ai/rules/api.md` only if
  they turn out wrong (`ai/rules/validation-errors.md` does not exist). No new decision record.

## Verification

`npm run lint`, `npm run format:check`, `npm test`. Manual check with no database (these errors occur
before any DB access; Docker Desktop is not running): import `src/app.js`, listen on port 4224, and
curl a body over 50kb (413), a koi8-r charset (415), invalid JSON (400), `/health` (200).
