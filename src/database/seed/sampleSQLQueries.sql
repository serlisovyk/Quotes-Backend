-- Find total qty of the rows in the Categories table
SELECT
    COUNT(*) AS category_count
FROM
    "Categories";

-- Find how many quotes have specific category
SELECT
    "Categories".id AS category_id,
    "Categories".name AS category_name,
    COUNT("QuoteCategories"."CategoryId") AS qty_of_quotes
FROM
    "Categories"
    LEFT JOIN "QuoteCategories" ON "Categories".id = "QuoteCategories"."CategoryId"
GROUP BY
    "Categories".id,
    "Categories".name
ORDER BY
    qty_of_quotes DESC
LIMIT
    100;

-- Find total qty of the categories which have just one quote
SELECT
    COUNT(*) AS total_categories_with_one_quote
FROM
    (
        SELECT
            "CategoryId"
        FROM
            "QuoteCategories"
        GROUP BY
            "CategoryId"
        HAVING
            COUNT(*) = 1
    ) AS single_quote_categories;

-- Find names of the categories which appear only in one quote
SELECT
    "Categories".name AS category_name
FROM
    (
        SELECT
            "CategoryId"
        FROM
            "QuoteCategories"
        GROUP BY
            "CategoryId"
        HAVING
            COUNT(*) = 1
    ) AS single_quote_categories
    JOIN "Categories" ON "Categories".id = single_quote_categories."CategoryId";

-- Find Ids of the categories which appear in one or two quotes
SELECT
    "CategoryId"
FROM
    "QuoteCategories"
GROUP BY
    "CategoryId"
HAVING
    COUNT(*) <= 2;

-- Find quotes without categories (they might be left after removal of the rare categories)
SELECT
    "Quotes".*
FROM
    "Quotes"
    LEFT JOIN "QuoteCategories" ON "Quotes".id = "QuoteCategories"."QuoteId"
WHERE
    "QuoteCategories"."CategoryId" IS NULL;