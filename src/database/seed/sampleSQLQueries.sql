-- Seed audit queries
-- Run these manually after importing or cleaning seed data.

-- Count imported rows
SELECT
    COUNT(*) AS quotes_count
FROM
    "Quotes";

SELECT
    COUNT(*) AS categories_count
FROM
    "Categories";

SELECT
    COUNT(*) AS quote_categories_count
FROM
    "QuoteCategories";

-- Find duplicate category names
SELECT
    name,
    COUNT(*) AS duplicates_count
FROM
    "Categories"
GROUP BY
    name
HAVING
    COUNT(*) > 1
ORDER BY
    duplicates_count DESC,
    name ASC;

-- Find category usage counts
SELECT
    "Categories".id AS category_id,
    "Categories".name AS category_name,
    COUNT("QuoteCategories"."QuoteId") AS quotes_count
FROM
    "Categories"
    LEFT JOIN "QuoteCategories" ON "Categories".id = "QuoteCategories"."CategoryId"
GROUP BY
    "Categories".id,
    "Categories".name
ORDER BY
    quotes_count DESC,
    category_name ASC
LIMIT
    100;

-- Find rare categories
SELECT
    "Categories".id AS category_id,
    "Categories".name AS category_name,
    COUNT("QuoteCategories"."QuoteId") AS quotes_count
FROM
    "Categories"
    JOIN "QuoteCategories" ON "Categories".id = "QuoteCategories"."CategoryId"
GROUP BY
    "Categories".id,
    "Categories".name
HAVING
    COUNT("QuoteCategories"."QuoteId") <= 2
ORDER BY
    quotes_count ASC,
    category_name ASC;

-- Find categories without quotes
SELECT
    "Categories".id,
    "Categories".name
FROM
    "Categories"
    LEFT JOIN "QuoteCategories" ON "Categories".id = "QuoteCategories"."CategoryId"
WHERE
    "QuoteCategories"."QuoteId" IS NULL
ORDER BY
    "Categories".name ASC;

-- Find quotes without categories
SELECT
    "Quotes".id,
    "Quotes".author,
    LEFT("Quotes".text, 120) AS text_preview
FROM
    "Quotes"
    LEFT JOIN "QuoteCategories" ON "Quotes".id = "QuoteCategories"."QuoteId"
WHERE
    "QuoteCategories"."CategoryId" IS NULL
ORDER BY
    "Quotes".id ASC;

-- Find suspicious quotes
SELECT
    id,
    author,
    LEFT(text, 120) AS text_preview
FROM
    "Quotes"
WHERE
    author IS NULL
    OR TRIM(author) = ''
    OR text IS NULL
    OR LENGTH(TRIM(text)) < 10
ORDER BY
    id ASC;

-- Find longest authors
SELECT
    id,
    author,
    LENGTH(author) AS author_length
FROM
    "Quotes"
ORDER BY
    author_length DESC
LIMIT
    50;
