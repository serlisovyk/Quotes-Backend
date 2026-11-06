# Spec: quote and category limits (MY-330)

Branch `my-330-quote-limits`. Upper bounds on quote input, so one request cannot carry thousands of
categories or an unbounded text. Success responses do not change.

## Limits

| Constant                   | Value  | Where it applies                                                              |
| -------------------------- | ------ | ----------------------------------------------------------------------------- |
| `MAX_CATEGORIES_PER_QUOTE` | `10`   | `categories` of `POST` and `PATCH /quotes`, after repeats are removed         |
| `CATEGORY_NAME_MAX_LENGTH` | `50`   | `categories[i]`, `?category=` of `GET /quotes`, `?name=` of `GET /categories` |
| `QUOTE_TEXT_MAX_LENGTH`    | `2500` | `text` of `POST` and `PATCH /quotes`, after trimming                          |

## Messages

Each failure is a 400 `VALIDATION_ERROR` with the message under the field name in `fields`.

| Field                               | Rule                                             | Message                                             |
| ----------------------------------- | ------------------------------------------------ | --------------------------------------------------- |
| `text`                              | a string, 10 to 2500 characters after trimming   | `Text must be a string from 10 to 2500 characters`  |
| `categories`                        | an array of 1 to 10 items, repeats removed first | `Categories must be an array of 1 to 10 categories` |
| `categories[i]`, `category`, `name` | at most 50 characters after trimming             | `Category name must be at most 50 characters`       |

The text and categories messages replace the older `Text must be a string of at least 10 characters`
and `Categories must be an array with at least one category`. The character rules of a category name
(`Category can only contain ...`) are unchanged and checked separately.

A body with eleven items but ten distinct names is accepted: repeats are removed before the count.

## Creating categories

`POST` and `PATCH /quotes` find or create the categories one after another in the quote's
transaction. The order and the stored result are the same as before.

## Seed import

The CSV import applies the same limits to a row: the quote text is cut to 2500 characters (as the
author already is), a category list longer than 10 keeps the first 10, and a row with a category name
longer than 50 characters is skipped (like a name with a space or an uppercase letter).
