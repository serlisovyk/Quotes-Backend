export function formatQuoteCategoriesAfterFind(results) {
  if (!results) return

  const quotes = Array.isArray(results) ? results : [results]

  quotes.forEach((quote) => {
    if (!quote.Categories) return

    quote.dataValues.categories = quote.Categories.map((category) => category.name)

    delete quote.dataValues.Categories
  })
}
