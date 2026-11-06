# Spec: strict rate limit on writes and 429 in the API error shape (MY-329)

Branch `my-329-write-rate-limit`. Linear issue MY-329.

## Problem

`POST`, `PATCH` and `DELETE /quotes` are open to everyone (decision `rejected-features`: no
authentication). The only limit is 100 requests per 15 minutes per IP for the whole API, so one
client can create, rewrite or delete up to 100 quotes in a window. Exceeding the limit also answers
with the plain text of `express-rate-limit`, not the API error shape.

## Behavior

| Limit   | Applies to                                                | Window     | Max requests per IP |
| ------- | --------------------------------------------------------- | ---------- | ------------------- |
| General | everything mounted after `/health` (unchanged)            | 15 minutes | `100`               |
| Write   | `POST /quotes`, `PATCH /quotes/:id`, `DELETE /quotes/:id` | 15 minutes | `20`                |

- A write request counts against both limits; a read counts only against the general one, so reads
  stay available after the write limit is spent.
- Both limits answer `429` with the common error shape, without `fields`:

| Status | `error.code`        | `error.message`                             |
| ------ | ------------------- | ------------------------------------------- |
| `429`  | `TOO_MANY_REQUESTS` | `Too many requests, please try again later` |

- Both send the standard `RateLimit-*` headers (`RateLimit`, `RateLimit-Policy`; plus `Retry-After`
  on `429`) and no legacy `X-RateLimit-*` headers.
- The write limit counts a request before validation, so invalid writes count too.
- `/health` stays outside both limits.

```http
POST /quotes
```

The 21st write within 15 minutes from one IP:

```json
{
  "error": {
    "code": "TOO_MANY_REQUESTS",
    "message": "Too many requests, please try again later"
  }
}
```

`GET /quotes` from the same IP still answers `200`.

## Out of scope

CORS restrictions, a read-only flag and an API key were considered and rejected by the author; the
protection of writes is the rate limit only. Limits on `/categories` writes do not exist (it has
none). A shared store (Redis) is out: the counters are in memory, per process
(`ai/rules/scope.md`).
