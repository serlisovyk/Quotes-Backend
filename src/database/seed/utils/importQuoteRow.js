import Quote from '../../models/Quote.js'
import { findOrCreateCategories } from '../../../services/categoriesService.js'
import validateAndSplitCategories from './validateAndSplitCategories.js'

export default async function importQuoteRow(row) {
  const { quote, author, category } = row

  const categories = validateAndSplitCategories(category)

  if (!categories.length) return

  const createdQuote = await Quote.create({
    text: quote,
    author: formatAuthorName(author),
  })

  const categoryInstances = await findOrCreateCategories(categories)

  await createdQuote.addCategories(categoryInstances)
}

function formatAuthorName(author) {
  if (!author) return null

  return author.split(',')[0].slice(0, 255)
}
