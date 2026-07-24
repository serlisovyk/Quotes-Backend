import { Op } from 'sequelize'
import Category from '../models/Category.js'
import { attributes } from '../constants/constants.js'

export const findCategories = async ({ limit, offset, name }) => {
  const whereClause = {}
  if (name) whereClause.name = { [Op.iLike]: `%${name}%` }

  const categories = await Category.findAll({
    attributes,
    limit,
    offset,
    order: [['id', 'ASC']],
    where: whereClause,
  })

  return categories
}

export const findSingleCategory = async (id) =>
  await Category.findByPk(id, { attributes })
