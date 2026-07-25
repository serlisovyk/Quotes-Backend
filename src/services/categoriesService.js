import Category from '../database/models/Category.js'
import {
  buildCategoryDetailsQuery,
  buildCategoryListQuery,
} from './utils/categoryQueryBuilder.js'

export const findCategories = async ({ limit, offset, name }) => {
  const categories = await Category.findAll({
    ...buildCategoryListQuery({ name }),
    limit,
    offset,
  })

  return categories
}

export const findSingleCategory = async (id) =>
  await Category.findByPk(id, buildCategoryDetailsQuery())

export const findOrCreateCategories = async (categoryNames, transaction) =>
  await Promise.all(
    categoryNames.map((name) =>
      Category.findOrCreate({
        where: { name },
        transaction,
      }).then(([category]) => category),
    ),
  )
