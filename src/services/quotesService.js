import Quote from '../database/models/Quote.js'
import sequelize from '../database/db.js'
import { setQuoteCategories } from './categoriesService.js'
import {
  buildQuoteDetailsQuery,
  buildQuoteListQuery,
  buildQuotesByIdsQuery,
  buildRandomQuotesQuery,
} from '../utils/queryBuilders/quoteQueryBuilder.js'

export const findQuotes = async ({ limit, offset, author, text, category }) => {
  const { rows: pageQuotes, count: total } = await Quote.findAndCountAll({
    ...buildQuoteListQuery({ author, text, category }),
    distinct: true,
    limit,
    offset,
  })

  if (!category) {
    return { total, quotes: pageQuotes }
  }

  const ids = pageQuotes.map((q) => q.id)

  const quotes = await findQuotesByIds(ids)

  return { total, quotes }
}

export const findRandomQuotes = async (limit) =>
  await Quote.findAll(buildRandomQuotesQuery(sequelize.random(), limit))

export const findSingleQuote = async (id) =>
  await Quote.findByPk(id, buildQuoteDetailsQuery())

export const createQuote = async ({ text, author, categories }) => {
  const createdQuoteId = await sequelize.transaction(async (transaction) => {
    const quote = await Quote.create({ text, author }, { transaction })

    await setQuoteCategories(quote, categories, transaction)

    return quote.id
  })

  return await findSingleQuote(createdQuoteId)
}

export const modifySingleQuote = async (id, { text, author, categories }) => {
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

  return await findSingleQuote(modifiedQuoteId)
}

export const deleteSingleQuote = async (id) => {
  const count = await Quote.destroy({ where: { id } })
  return count > 0
}

async function findQuotesByIds(ids) {
  return await Quote.findAll(buildQuotesByIdsQuery(ids))
}
