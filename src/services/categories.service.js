import Category from '../database/models/category.model.js'
import {
  buildCategoryDetailsQuery,
  buildCategoryListQuery,
} from '../utils/query-builders/category-query-builder.util.js'

export async function findCategories({ limit, offset, name }) {
  const categories = await Category.findAll({
    ...buildCategoryListQuery({ name }),
    limit,
    offset,
  })

  return categories
}

export async function findSingleCategory(id) {
  return await Category.findByPk(id, buildCategoryDetailsQuery())
}

export async function findOrCreateCategories(categoryNames, transaction) {
  return await Promise.all(
    categoryNames.map((name) =>
      Category.findOrCreate({
        where: { name },
        transaction,
      }).then(([category]) => category),
    ),
  )
}

export async function setQuoteCategories(quote, categoryNames, transaction) {
  const categoryInstances = await findOrCreateCategories(categoryNames, transaction)
  await quote.setCategories(categoryInstances, { transaction })
}
