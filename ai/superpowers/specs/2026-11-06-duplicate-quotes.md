# Spec: duplicate quote protection (MY-337)

Branch `my-337-duplicate-quotes`. `POST /quotes` and `PATCH /quotes/:id` refuse a write that would
leave two quotes with the same text and author. Every other behavior and every success response stay
as they are.

## What a duplicate is

Two quotes are duplicates when their `text` and their `author` are both equal after trimming and
ignoring case. The request values are already trimmed by the validators; the comparison is
case-insensitive (`lower(text)` and `lower(author)` against the lowercased request values).
Categories play no part: the same text and author with other categories is still a duplicate.

## POST /quotes

If a quote with the same text and author exists, the answer is `409` `CONFLICT` and nothing is
created (no quote, no category).

## PATCH /quotes/:id

The text and the author the quote would have after the patch are the stored value, replaced by the
patched one when the body has it. If another quote (a different `id`) already has that text and
author, the answer is `409` `CONFLICT` and nothing is changed, categories included.

- Patching a quote to its own current values, or changing only its categories, is not a conflict.
- A patch to a missing quote is still `404`; a `400` for validation is still checked first.

## Error

Common error shape, no `fields`:

```json
{
  "error": {
    "code": "CONFLICT",
    "message": "A quote with the same text and author already exists"
  }
}
```

| Status | Code       | When                                                                |
| ------ | ---------- | ------------------------------------------------------------------- |
| 409    | `CONFLICT` | the write would create a second quote with the same text and author |

Like every error, the `409` is sent with `Cache-Control: no-store`.

## Limits of the check

There is no unique index, so two identical `POST` requests sent at the same moment can both pass the
check and both be stored. Existing duplicate rows (seed data, earlier writes) are left alone; only a
new write is checked.
