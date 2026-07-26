import { Op } from 'sequelize'

export function buildLikeFilters(filters) {
  return Object.entries(filters).reduce((where, [field, value]) => {
    if (!value) return where

    return {
      ...where,
      [field]: { [Op.iLike]: `%${value}%` },
    }
  }, {})
}
