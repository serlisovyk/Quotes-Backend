# Spec: quote validators (MY-225)

Branch `my-225-quote-validators`. Validation of quote input: messages, the numeric-text hole,
duplicate categories, an empty `PATCH`. Success responses do not change.

## Messages

Every validation failure of a quote request carries a message from `ERROR_MESSAGE`; the failure sits
under the field name in `fields`.

| Field                                        | Rule                                            | Message                                                           |
| -------------------------------------------- | ----------------------------------------------- | ----------------------------------------------------------------- |
| `text`                                       | a string, at least 10 characters after trimming | `Text must be a string of at least 10 characters`                 |
| `author`                                     | a string, 2 to 255 characters after trimming    | `Author must be a string from 2 to 255 characters`                |
| `categories`                                 | an array with at least one item                 | `Categories must be an array with at least one category`          |
| `categories[i]`                              | lowercase letters, numbers and dashes           | `Category can only contain lowercase letters, numbers and dashes` |
| `limit` of `GET /quotes/random`              | an integer from 1 to 20                         | `Limit must be in range 1..20`                                    |
| `offset` of `GET /quotes`, `GET /categories` | an integer, 0 or more                           | `Offset must be an integer, 0 or more`                            |

`text` and `author` are checked as strings before trimming: a number is a 400, not a string made of
its digits.

```http
POST /quotes
{ "text": 12345678901, "author": "Seneca", "categories": ["life"] }
```

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request data",
    "fields": { "text": "Text must be a string of at least 10 characters" }
  }
}
```

`text` is required on `POST` and optional on `PATCH`, with the same message in both cases. This
replaces the two older texts («Text is required and has to be minimum 10 characters» and «Text has to
be minimum 10 characters»).

## Duplicate categories

Repeated names in `categories` (after trimming) are removed silently; the first occurrence stays and
the order is kept. `{ "categories": ["life", "life", "work"] }` is stored as `life`, `work`; the
answer is the usual 201 or 200, never a 500. A name that fails the category rule is still a 400.

## Empty PATCH

`PATCH /quotes/:id` whose body has none of `text`, `author`, `categories` is a 400 under `_root`:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request data",
    "fields": { "_root": "Nothing to update" }
  }
}
```

A body with at least one of them is validated as before. An invalid ID is still reported under `id`,
possibly next to `_root`.
