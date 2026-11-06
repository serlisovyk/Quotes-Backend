# Spec: Cache-Control and response compression (MY-336)

Branch `my-336-cache-compression`. Linear issue MY-336.

## Problem

GET answers carry no `Cache-Control` and are never compressed: a client or a proxy cannot cache them,
and a list of 50 quotes travels as plain JSON.

## Behavior

### `Cache-Control` (author's decision, 2026-11-06: short cache, 60 seconds)

| Response                                                                            | `Cache-Control`      |
| ----------------------------------------------------------------------------------- | -------------------- |
| `200` of `GET /quotes`, `GET /quotes/:id`, `GET /categories`, `GET /categories/:id` | `public, max-age=60` |
| `200` of `GET /`                                                                    | `public, max-age=60` |
| `GET /quotes/random` (any status)                                                   | `no-store`           |
| `GET /health` (`200` and `503`)                                                     | `no-store`           |
| every error answered by the error middleware (`400`, `404`, `429`, `500`, `503`, …) | `no-store`           |
| `POST`, `PATCH`, `DELETE` successes                                                 | no header            |

- A `404` or `400` of a cacheable read route never carries `public, max-age=60`.
- `GET /` is static, but it takes the same 60 seconds: one value for every cacheable read, and a
  deploy that changes the payload reaches clients within a minute.
- The `ETag` Express adds to `res.json` stays; a repeated request with `If-None-Match` still gets `304`.
- Body shapes, status codes and the error format do not change.

### Compression

- A response is compressed (gzip, deflate or br) when the client sends a matching `Accept-Encoding`
  and the body is over the `compression` threshold (1 kb by default); smaller bodies stay plain.
- Compressed answers carry `Content-Encoding` and `Vary: Accept-Encoding`.
- Applies to every route, errors included.

## Not changing

No `Expires`, no `Last-Modified`, no custom `ETag`, no `max-age` other than 60 s.
