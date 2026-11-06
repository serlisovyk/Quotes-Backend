import { Quote } from '#models'
import sequelize from '#database'
import {
  buildDuplicateQuoteQuery,
  buildQuoteDetailsQuery,
  buildQuoteListQuery,
  buildQuotesByIdsQuery,
  buildRandomQuotesQuery,
} from '#utils/query-builders/quote-query-builder'
import { setQuoteCategories } from '#services/categories'
import { ConflictError } from '#errors/classes'
import { ERROR_MESSAGE } from '#constants'

export async function findQuotes({
  limit,
  offset,
  author,
  text,
  search,
  category,
  sort,
  order,
}) {
  const { rows: pageQuotes, count: total } = await Quote.findAndCountAll({
    ...buildQuoteListQuery({ author, text, search, category, sort, order }),
    distinct: true,
    limit,
    offset,
  })

  const ids = pageQuotes.map(({ id }) => id)

  const quotes = await findQuotesByIds(ids, { sort, order })

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
    await assertQuoteIsUnique({ text, author }, transaction)

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

    await assertQuoteIsUnique(
      { text: quote.text, author: quote.author, excludeId: quote.id },
      transaction,
    )

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
  const deletedCount = await Quote.destroy({ where: { id } })
  const isDeleted = deletedCount > 0

  return isDeleted
}

async function assertQuoteIsUnique({ text, author, excludeId }, transaction) {
  const duplicate = await Quote.findOne({
    ...buildDuplicateQuoteQuery({ text, author, excludeId }),
    transaction,
  })

  if (duplicate) {
    throw new ConflictError(ERROR_MESSAGE.QUOTE_ALREADY_EXISTS)
  }
}

async function findQuotesByIds(ids, sortOptions) {
  return Quote.findAll(buildQuotesByIdsQuery(ids, sortOptions))
}
