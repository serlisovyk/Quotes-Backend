import { Op } from 'sequelize'
import escapeLikePattern from '#utils/database/escape-like-pattern'

export function buildLikeFilters(filters) {
  return Object.entries(filters).reduce((where, [field, value]) => {
    if (!value) return where

    return {
      ...where,
      [field]: { [Op.iLike]: `%${escapeLikePattern(value)}%` },
    }
  }, {})
}
