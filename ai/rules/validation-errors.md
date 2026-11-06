# Validation & Error Rules

## Validation

- Validate external input with Express Validator before controllers use it.
- Keep validator chains in `src/validators/<resource>`.
- Keep shared validators in `src/validators/shared`.
- Reuse domain constants in validators when possible.
- Convert numeric request values in validators when controllers/services expect numbers.
- Do not add config validation in this project unless the user explicitly asks for it.

## Validated Data

- Controllers may read from `req.query`, `req.params`, and `req.body` after route validators and `validationErrorHandler` have run.
- Services should receive already validated and normalized values.
- Do not duplicate route validation inside services.

## Error Shape

Return API errors in this shape:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request data",
    "fields": {
      "limit": "Limit must be in range 1..50"
    }
  }
}
```

Validation errors that are related to the whole request instead of a specific field are placed under the `_root` key.

## Error Constants

- Keep error codes in `ERROR_CODE`.
- Keep error messages in `ERROR_MESSAGE`.
- Do not hardcode repeated error strings inside controllers, services, or middlewares.
- Dynamic messages may be functions on `ERROR_MESSAGE`, for example `ERROR_MESSAGE.QUOTE_NOT_FOUND(id)`.

## AppError

- Throw subclasses of `AppError` for operational errors.
- Let `asyncHandler` pass async errors to the centralized error middleware.
- Keep error normalization in the error factory layer.
- Do not add `try/catch` blocks inside controllers unless a controller has a genuinely local recovery path.
