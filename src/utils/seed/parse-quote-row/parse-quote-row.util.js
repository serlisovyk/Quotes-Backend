import validateAndSplitCategories from '#utils/seed/validate-and-split-categories'
import { QUOTE_AUTHOR_MAX_LENGTH, QUOTE_TEXT_MAX_LENGTH } from '#constants'

function getQuoteAuthor(author) {
  return author.split(',')[0].slice(0, QUOTE_AUTHOR_MAX_LENGTH)
}

function getQuoteText(text) {
  return text.slice(0, QUOTE_TEXT_MAX_LENGTH)
}

export default function parseQuoteRow(row) {
  const categories = validateAndSplitCategories(row.category)

  if (!categories.length) return null

  const author = getQuoteAuthor(row.author)

  const text = getQuoteText(row.quote)

  return { text, author, categories }
}
