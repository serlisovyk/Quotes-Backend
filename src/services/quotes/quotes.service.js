import { Quote } from '#models'
import sequelize from '#database'
import {
  buildQuoteDetailsQuery,
  buildQuoteListQuery,
  buildQuotesByIdsQuery,
  buildRandomQuotesQuery,
} from '#utils/query-builders/quote-query-builder'
import { setQuoteCategories } from '#services/categories'

export async function findQuotes({ limit, offset, author, text, category }) {
  const { rows: pageQuotes, count: total } = await Quote.findAndCountAll({
    ...buildQuoteListQuery({ author, text, category }),
    distinct: true,
    limit,
    offset,
  })

  if (!category) {
    return { total, quotes: pageQuotes }
  }

  const ids = pageQuotes.map(({ id }) => id)

  const quotes = await findQuotesByIds(ids)

  return { total, quotes }
}

export async function findRandomQuotes(limit) {
  return Quote.findAll(buildRandomQuotesQuery(sequelize.random(), limit))
}

export async function findSingleQuote(id) {
  return Quote.findByPk(id, buildQuoteDetailsQuery())
}

export async function createQuote({ text, author, categories }) {
  const createdQuoteId = await sequelize.transaction(async (transaction) => {
    const quote = await Quote.create({ text, author }, { transaction })

    await setQuoteCategories(quote, categories, transaction)

    return quote.id
  })

  return findSingleQuote(createdQuoteId)
}

export async function modifySingleQuote(id, { text, author, categories }) {
  const modifiedQuoteId = await sequelize.transaction(async (transaction) => {
    const quote = await Quote.findByPk(id, { transaction })

    if (!quote) return null

    if (text) quote.text = text
    if (author) quote.author = author

    await quote.save({ transaction })

    if (categories) {
      await setQuoteCategories(quote, categories, transaction)
    }

    return quote.id
  })

  if (!modifiedQuoteId) return null

  return findSingleQuote(modifiedQuoteId)
}

export async function deleteSingleQuote(id) {
  const count = await Quote.destroy({ where: { id } })
  return count > 0
}

async function findQuotesByIds(ids) {
  return Quote.findAll(buildQuotesByIdsQuery(ids))
}
