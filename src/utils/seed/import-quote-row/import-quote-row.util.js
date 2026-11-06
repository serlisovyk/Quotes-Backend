import { Quote } from '#models'
import { findOrCreateCategories } from '#services/categories'
import validateAndSplitCategories from '#utils/seed/validate-and-split-categories'
import { QUOTE_AUTHOR_MAX_LENGTH } from '#constants'

const getQuoteAuthor = (author) =>
  author.split(',')[0].slice(0, QUOTE_AUTHOR_MAX_LENGTH)

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
