import { query } from 'express-validator'
import {
  categorySearchValidator,
  idParamValidator,
  listLimitQueryValidator,
  offsetQueryValidator,
} from '../shared/index.js'

export const getCategoriesValidators = [
  listLimitQueryValidator(),
  offsetQueryValidator(),
  categorySearchValidator(query('name').optional()),
]

export const getSingleCategoryValidators = [idParamValidator()]
