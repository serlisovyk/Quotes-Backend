import { param, query } from 'express-validator'
import {
  CATEGORY_NAME_I_REGEX,
  CATEGORY_NAME_REGEX,
  ERROR_MESSAGE,
  MAX_ENTITY_ID,
  MAX_LIST_LIMIT,
} from '../constants/constants.js'

export const listLimitQueryValidator = () =>
  query('limit')
    .optional()
    .trim()
    .isInt({ min: 1, max: MAX_LIST_LIMIT })
    .withMessage(ERROR_MESSAGE.INVALID_LIST_LIMIT)
    .toInt()

export const offsetQueryValidator = () =>
  query('offset').optional().trim().isInt({ min: 0 }).toInt()

export const idParamValidator = () =>
  param('id')
    .trim()
    .isInt({ min: 1, max: MAX_ENTITY_ID })
    .withMessage(ERROR_MESSAGE.INVALID_ENTITY_ID)
    .toInt()

export const categoryNameValidator = (field) =>
  field
    .trim()
    .matches(CATEGORY_NAME_REGEX)
    .withMessage(ERROR_MESSAGE.INVALID_CATEGORY_NAME)

export const categorySearchValidator = (field) =>
  field
    .trim()
    .matches(CATEGORY_NAME_I_REGEX)
    .withMessage(ERROR_MESSAGE.INVALID_CATEGORY_SEARCH)
