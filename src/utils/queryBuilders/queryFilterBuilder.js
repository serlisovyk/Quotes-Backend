import { Op } from 'sequelize'

export const buildLikeFilters = (filters) =>
  Object.entries(filters).reduce((where, [field, value]) => {
    if (!value) return where

    return {
      ...where,
      [field]: { [Op.iLike]: `%${value}%` },
    }
  }, {})
