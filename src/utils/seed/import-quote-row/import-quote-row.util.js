import { Quote } from '#models'
import { findOrCreateCategories } from '#services/categories'
import validateAndSplitCategories from '#utils/seed/validate-and-split-categories'

const getQuoteAuthor = (author) => author.split(',')[0].slice(0, 255)

export default async function importQuoteRow(row) {
  const categories = validateAndSplitCategories(row.category)

  if (!categories.length) return

  const quote = await Quote.create({
    text: row.quote,
    author: getQuoteAuthor(row.author),
  })

  const categoryInstances = await findOrCreateCategories(categories)

  await quote.addCategories(categoryInstances)
}
