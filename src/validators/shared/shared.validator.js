import { param, query } from 'express-validator'
import {
  CATEGORY_NAME_I_REGEX,
  CATEGORY_NAME_MAX_LENGTH,
  CATEGORY_NAME_REGEX,
  MAX_ENTITY_ID,
  MAX_LIST_LIMIT,
  ERROR_MESSAGE,
} from '#constants'

export function listLimitQueryValidator() {
  return query('limit')
    .optional()
    .trim()
    .isInt({ min: 1, max: MAX_LIST_LIMIT })
    .withMessage(ERROR_MESSAGE.INVALID_LIST_LIMIT)
    .toInt()
}

export function offsetQueryValidator() {
  return query('offset')
    .optional()
    .trim()
    .isInt({ min: 0 })
    .withMessage(ERROR_MESSAGE.INVALID_OFFSET)
    .toInt()
}

export function idParamValidator() {
  return param('id')
    .trim()
    .isInt({ min: 1, max: MAX_ENTITY_ID })
    .withMessage(ERROR_MESSAGE.INVALID_ENTITY_ID)
    .toInt()
}

export function categoryNameValidator(field) {
  return field
    .trim()
    .matches(CATEGORY_NAME_REGEX)
    .withMessage(ERROR_MESSAGE.INVALID_CATEGORY_NAME)
    .isLength({ max: CATEGORY_NAME_MAX_LENGTH })
    .withMessage(ERROR_MESSAGE.CATEGORY_NAME_TOO_LONG)
}

export function categorySearchValidator(field) {
  return field
    .trim()
    .matches(CATEGORY_NAME_I_REGEX)
    .withMessage(ERROR_MESSAGE.INVALID_CATEGORY_SEARCH)
    .isLength({ max: CATEGORY_NAME_MAX_LENGTH })
    .withMessage(ERROR_MESSAGE.CATEGORY_NAME_TOO_LONG)
}
