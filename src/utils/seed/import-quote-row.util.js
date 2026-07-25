import Quote from '../../database/models/quote.model.js'
import { findOrCreateCategories } from '../../services/categories.service.js'
import validateAndSplitCategories from './validate-and-split-categories.util.js'

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
