import validateAndSplitCategories from '#utils/seed/validate-and-split-categories'
import { QUOTE_AUTHOR_MAX_LENGTH } from '#constants'

const getQuoteAuthor = (author) =>
  author.split(',')[0].slice(0, QUOTE_AUTHOR_MAX_LENGTH)

export default function parseQuoteRow(row) {
  const categories = validateAndSplitCategories(row.category)

  if (!categories.length) return null

  return {
    text: row.quote,
    author: getQuoteAuthor(row.author),
    categories,
  }
}
