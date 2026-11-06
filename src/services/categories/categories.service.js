import { Category } from '#models'
import {
  buildCategoryDetailsQuery,
  buildCategoryListQuery,
} from '#utils/query-builders/category-query-builder'

export async function findCategories({ limit, offset, name }) {
  const { rows: categories, count: total } = await Category.findAndCountAll({
    ...buildCategoryListQuery({ name }),
    limit,
    offset,
  })

  return { total, categories }
}

export async function findSingleCategory(id) {
  return Category.findByPk(id, buildCategoryDetailsQuery())
}

export async function findOrCreateCategories(categoryNames, transaction) {
  return Promise.all(
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
