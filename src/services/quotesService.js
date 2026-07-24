import { Op } from 'sequelize'
import Quote from '../models/Quote.js'
import Category from '../models/Category.js'
import sequelize from '../database/db.js'
import { attributes } from '../constants/constants.js'

const includeCategoryConfig = {
  model: Category,
  attributes: ['name'],
  through: { attributes: [] },
}

export const findQuotes = async ({ limit, offset, author, text, category }) => {
  const whereClause = {}
  if (author) whereClause.author = { [Op.iLike]: `%${author}%` }
  if (text) whereClause.text = { [Op.iLike]: `%${text}%` }

  const baseQuery = {
    attributes,
    order: [['id', 'ASC']],
    where: whereClause,
    include: {
      ...includeCategoryConfig,
      ...(category ? { where: { name: category } } : {}),
    },
  }

  const { rows: pageQuotes, count: total } = await Quote.findAndCountAll({
    ...baseQuery,
    distinct: true,
    limit,
    offset,
  })

  if (!category) {
    return { total, quotes: pageQuotes }
  }

  const ids = pageQuotes.map((q) => q.id)

  const quotes = await Quote.findAll({
    attributes,
    order: [['id', 'ASC']],
    include: includeCategoryConfig,
    where: { id: ids },
  })

  return { total, quotes }
}

export const findRandomQuotes = async (limit) =>
  await Quote.findAll({
    attributes,
    limit,
    order: sequelize.random(),
    include: includeCategoryConfig,
  })

export const findSingleQuote = async (id) =>
  await Quote.findByPk(id, { attributes, include: includeCategoryConfig })

export const createQuote = async ({ text, author, categories }) => {
  const createdQuoteId = await sequelize.transaction(async (transaction) => {
    const quote = await Quote.create({ text, author }, { transaction })

    const categoryInstances = await findOrCreateCategories(categories, transaction)
    await quote.setCategories(categoryInstances, { transaction })

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
      const categoryInstances = await findOrCreateCategories(categories, transaction)
      await quote.setCategories(categoryInstances, { transaction })
    }

    return quote.id
  })

  return await findSingleQuote(modifiedQuoteId)
}

export const deleteSingleQuote = async (id) => {
  const count = await Quote.destroy({ where: { id } })
  if (count) return id
}

async function findOrCreateCategories(categoryNames, transaction) {
  return await Promise.all(
    categoryNames.map((name) =>
      Category.findOrCreate({
        where: { name },
        transaction,
      }).then(([category]) => category)
    )
  )
}
