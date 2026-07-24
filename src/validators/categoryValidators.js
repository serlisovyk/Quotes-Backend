import { query, param } from 'express-validator'
import { CATEGORY_NAME_I_REGEX } from '../constants/constants.js'

export const getCategoriesValidators = [
  query('limit').optional().trim().isInt({ min: 1, max: 50 }),
  query('offset').optional().trim().isInt({ min: 0 }),
  query('name')
    .optional()
    .trim()
    .escape()
    .custom((value) =>
      CATEGORY_NAME_I_REGEX.test(value)
        ? Promise.resolve()
        : Promise.reject('Category can only contain letters and dashes')
    ),
]

export const getSingleCategoryValidators = [param('id').trim().isInt({ min: 1 })]
