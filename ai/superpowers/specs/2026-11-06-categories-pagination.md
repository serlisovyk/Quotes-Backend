# Spec: list response format (MY-228)

Branch `my-228-categories-pagination`. `GET /categories` answers in the same shape as `GET /quotes`,
so a client can paginate both lists. Backend part only; the frontend part is a separate step.

## Response

```http
GET /categories?limit=2&offset=1&name=li
```

```json
{
  "total": 5,
  "categories": [
    { "id": 2, "name": "life" },
    { "id": 3, "name": "limits" }
  ]
}
```

- `total` is the number of categories matching `name`, ignoring `limit` and `offset`.
- `categories` is the requested page, ordered by ID ascending, as before.
- An empty result is `200` with `{ "total": 0, "categories": [] }`, never an error.
- Query parameters, validation and error responses do not change.

Before, the body was a bare array of categories.

## Unchanged

- `GET /quotes` keeps `{ total, quotes }`.
- `GET /categories/:id` and every other endpoint do not change.

## Risk

This is a breaking change of the `/categories` contract. Quotes-Frontend never calls `/categories`
(categories arrive only inside quotes), so no deployed client breaks and the deploy order does not
matter. Any other client of `GET /categories` must read `categories` from the object.
