import Category from '../database/models/Category.js'

export const PUBLIC_MODEL_ATTRIBUTES = {
  exclude: ['createdAt', 'updatedAt'],
}

export const ORDER_BY_ID_ASC = [['id', 'ASC']]

export const QUOTE_CATEGORY_INCLUDE = {
  model: Category,
  attributes: ['name'],
  through: { attributes: [] },
}
