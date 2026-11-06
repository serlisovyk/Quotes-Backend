# API Rules

The contract every endpoint keeps: validation, errors and responses. Why: decisions
`async-handler-with-express-5` and `rejected-features`. Layers: `ai/rules/architecture.md`.

## Validation

- External input is validated with Express Validator before a controller reads it. The chains live in
  `validators/<resource>`; the reusable ones (limit, offset, id, category name) in `validators/shared`.
- A route lists its validators, then `validationErrorHandler`, then `asyncHandler(controller)`.
- A validator converts numbers (`.toInt()`) when the controller or the service expects a number, and
  takes values and messages from the constants.
- A controller reads `req.query`, `req.params` and `req.body` only after the validators and
  `validationErrorHandler` have run. A service receives validated, normalized values and never
  validates again.

## Errors

- The API answers every error in one shape; a failure of the whole request, not of one field, sits
  under the `_root` key:

  ```json
  {
    "error": {
      "code": "VALIDATION_ERROR",
      "message": "Invalid request data",
      "fields": { "limit": "Limit must be in range 1..50" }
    }
  }
  ```

- Codes are `ERROR_CODE` entries, messages `ERROR_MESSAGE` entries; a repeated string is never
  written inline. A message that needs a value is a function: `ERROR_MESSAGE.QUOTE_NOT_FOUND(id)`.
- An operational error is thrown as a subclass of `AppError`. A missing row is a `NotFoundError`
  thrown by the controller.
- `asyncHandler` wraps every async controller in the router and hands a rejection to the central
  error middleware, which normalizes it through `ErrorFactory`. An error that is not an `AppError`
  is logged and answered as `INTERNAL_SERVER_ERROR`, except the errors `express.json` raises before a
  route runs: invalid JSON is `400 INVALID_JSON`, a body over `JSON_BODY_LIMIT` is `413
PAYLOAD_TOO_LARGE`, an unsupported charset or encoding is `415 UNSUPPORTED_MEDIA_TYPE`; none of
  them is logged. `ErrorFactory` recognizes them by the parser error `type`.

## Responses

- A response goes through the helpers in `utils/http/response`: `sendOk`, `sendCreated` (with the
  `Location` of the new resource), `sendNoContent`.
- Status codes come from `HTTP_STATUS`, paths from `ROUTE` and `ROUTER_PATH`.
- A list endpoint answers an empty array, never an error, for an empty result.
- A public model answer leaves out `createdAt` and `updatedAt` (`PUBLIC_MODEL_ATTRIBUTES`).
- `/health` is mounted before the rate limiter and is not logged.
