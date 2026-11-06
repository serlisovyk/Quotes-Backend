# Lists answer `{ total, <resource> }`

Date: 2026-11-06 · Status: accepted

## Context

`GET /quotes` answered `{ total, quotes }`, while `GET /categories` answered a bare array, so a client
could not paginate categories and the two lists of one API looked different (MY-228).

## Decision

Every list endpoint answers an object with `total` (every match, ignoring `limit` and `offset`) and
the page under the plural name of the resource: `{ total, quotes }`, `{ total, categories }`. An empty
result is `total: 0` with an empty array. The service returns that object (`findAndCountAll`, with
`distinct` when an include can inflate the count) and the controller sends it as is.

Rejected: a generic `{ total, items }` for all lists. It would change `GET /quotes`, break its
clients, and the resource name in the key already says what the array holds.

## Consequences

- A new list endpoint follows this shape.
- `GET /categories` changed from an array to an object. Quotes-Frontend never calls it, so nothing
  deployed broke.
- Reversing it (for example to `{ total, items }`) needs a new dated record.
