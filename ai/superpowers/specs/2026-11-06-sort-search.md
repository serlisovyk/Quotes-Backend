# Spec: sorting and general search of quotes (MY-335)

Branch `my-335-sort-search`. `GET /quotes` gets three new optional query parameters. Without them
the answer is the same as before: sorted by `id` ascending, filtered only by `author`, `text` and
`category`. The response shape `{ total, quotes }` does not change.

## Parameters

| Parameter | Allowed values                   | Default | Meaning                                          |
| --------- | -------------------------------- | ------- | ------------------------------------------------ |
| `sort`    | `id`, `author`, `createdAt`      | `id`    | the field the page is ordered by                 |
| `order`   | `asc`, `desc`                    | `asc`   | the direction of `sort`                          |
| `search`  | a string, at most 100 characters | none    | case-insensitive substring of `text` OR `author` |

- Values are matched exactly after trimming: `sort=Author` and `order=DESC` are rejected.
- Rows with equal `sort` values are ordered by `id` ascending, whatever `order` is, so a page is
  stable and `offset` never repeats or skips a row.
- `search` is escaped like `author` and `text` (`%`, `_` and `\` match themselves). An empty `search` (after
  trimming) is ignored.
- `search` is combined with `author`, `text` and `category` by AND; inside `search`, `text` and `author` are
  combined by OR.
- `total` counts every match of the filters, `search` included, and does not depend on `sort`, `order`,
  `limit` or `offset`.
- `createdAt` is a sort key only: the field is still not part of the answer.

## Errors

A bad value is a 400 `VALIDATION_ERROR` with the message under the parameter name in `fields`.

| Field    | Rule                                  | Message                                      |
| -------- | ------------------------------------- | -------------------------------------------- |
| `sort`   | one of `id`, `author`, `createdAt`    | `Sort must be one of: id, author, createdAt` |
| `order`  | `asc` or `desc`                       | `Order must be asc or desc`                  |
| `search` | at most 100 characters after trimming | `Search must be at most 100 characters`      |

## Examples

```http
GET /quotes?sort=author&order=desc
GET /quotes?search=love
GET /quotes?search=love&category=wisdom&sort=createdAt&order=desc&limit=5&offset=5
GET /quotes?sort=foo          -> 400 fields.sort
GET /quotes?order=up          -> 400 fields.order
```
