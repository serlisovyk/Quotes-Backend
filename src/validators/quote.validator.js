import { query, body } from 'express-validator'
import { CATEGORY_NAME_REGEX } from '../constants/validation.constant.js'
import { ERROR_MESSAGE } from '../constants/errors.constant.js'
import { MAX_RANDOM_QUOTES_LIMIT } from '../constants/app.constant.js'
import {
  categoryNameValidator,
  idParamValidator,
  listLimitQueryValidator,
  offsetQueryValidator,
} from './shared.validator.js'

function quoteTextBodyValidator({ optional = false } = {}) {
  const validator = body('text')

  if (optional) validator.optional()

  return validator
    .trim()
    .isString()
    .isLength({ min: 10 })
    .withMessage(
      optional
        ? 'Text has to be minimum 10 characters'
        : 'Text is required and has to be minimum 10 characters',
    )
}

function quoteAuthorBodyValidator({ optional = false } = {}) {
  const validator = body('author')

  if (optional) validator.optional()

  return validator
    .trim()
    .isString()
    .isLength({ min: 2, max: 255 })
    .withMessage('Author must be a string from 2 to 255 characters')
}

function quoteCategoriesBodyValidator({ optional = false } = {}) {
  const validator = body('categories')

  if (optional) validator.optional()

  return validator
    .isArray({ min: 1 })
    .withMessage('Categories must be an array with at least one category')
}

function quoteCategoryItemBodyValidator({ optional = false } = {}) {
  const validator = body('categories.*')
  if (optional) validator.optional()

  return validator
    .trim()
    .matches(CATEGORY_NAME_REGEX)
    .withMessage(ERROR_MESSAGE.INVALID_CATEGORY_NAME)
}

export const getQuotesValidators = [
  listLimitQueryValidator(),
  offsetQueryValidator(),
  query('author').optional().trim(),
  query('text').optional().trim(),
  categoryNameValidator(query('category').optional()),
]

export const getRandomQuotesValidators = [
  query('limit')
    .optional()
    .trim()
    .isInt({ min: 1, max: MAX_RANDOM_QUOTES_LIMIT })
    .toInt(),
]

export const postQuoteValidators = [
  quoteTextBodyValidator(),
  quoteAuthorBodyValidator(),
  quoteCategoriesBodyValidator(),
  quoteCategoryItemBodyValidator(),
]

export const getSingleQuoteValidators = [idParamValidator()]

export const deleteSingleQuoteValidators = [idParamValidator()]

export const patchSingleQuoteValidators = [
  idParamValidator(),
  quoteTextBodyValidator({ optional: true }),
  quoteAuthorBodyValidator({ optional: true }),
  quoteCategoriesBodyValidator({ optional: true }),
  quoteCategoryItemBodyValidator({ optional: true }),
]
