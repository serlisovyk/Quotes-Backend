# Spec: body parser errors answer 413 and 415 (MY-224)

Branch `my-224-payload-errors`. Linear issue MY-224.

## Problem

`express.json` rejects some requests before any route runs. Invalid JSON is already `400
INVALID_JSON`, but a body over `JSON_BODY_LIMIT` (50kb) and an unsupported charset or encoding fall
into `500 INTERNAL_SERVER_ERROR` and are logged as "Unhandled application error", although they are
expected client errors.

## Behavior

All answers keep the common error shape, without `fields`.

| Request                                                      | Status | `error.code`             | `error.message`          |
| ------------------------------------------------------------ | ------ | ------------------------ | ------------------------ |
| JSON body larger than `JSON_BODY_LIMIT` (`entity.too.large`) | `413`  | `PAYLOAD_TOO_LARGE`      | `Payload too large`      |
| Unsupported charset (`charset.unsupported`)                  | `415`  | `UNSUPPORTED_MEDIA_TYPE` | `Unsupported media type` |
| Unsupported `Content-Encoding` (`encoding.unsupported`)      | `415`  | `UNSUPPORTED_MEDIA_TYPE` | `Unsupported media type` |
| Invalid JSON (unchanged)                                     | `400`  | `INVALID_JSON`           | `Invalid JSON`           |

Neither 413 nor 415 is logged as an unhandled error.

```http
POST /quotes
Content-Type: application/json; charset=koi8-r

{"text":"a","author":"b","categories":["c"]}
```

```json
{
  "error": { "code": "UNSUPPORTED_MEDIA_TYPE", "message": "Unsupported media type" }
}
```

## Out of scope

`entity.verify.failed` is not handled: the project has no `verify` option. Other body-parser errors
stay `500`.
