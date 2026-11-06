import { query, body } from 'express-validator'
import removeDuplicateCategories from '#utils/validation/remove-duplicate-categories'
import {
  categoryNameValidator,
  idParamValidator,
  listLimitQueryValidator,
  offsetQueryValidator,
} from '#validators/shared'
import {
  ERROR_MESSAGE,
  MAX_CATEGORIES_PER_QUOTE,
  MAX_RANDOM_QUOTES_LIMIT,
  QUOTE_AUTHOR_MAX_LENGTH,
  QUOTE_AUTHOR_MIN_LENGTH,
  QUOTE_PATCH_FIELDS,
  QUOTE_TEXT_MAX_LENGTH,
  QUOTE_TEXT_MIN_LENGTH,
} from '#constants'

function quoteTextBodyValidator({ optional = false } = {}) {
  const validator = body('text')

  if (optional) validator.optional()

  return validator
    .isString()
    .withMessage(ERROR_MESSAGE.INVALID_QUOTE_TEXT)
    .bail()
    .trim()
    .isLength({ min: QUOTE_TEXT_MIN_LENGTH, max: QUOTE_TEXT_MAX_LENGTH })
    .withMessage(ERROR_MESSAGE.INVALID_QUOTE_TEXT)
}

function quoteAuthorBodyValidator({ optional = false } = {}) {
  const validator = body('author')

  if (optional) validator.optional()

  return validator
    .isString()
    .withMessage(ERROR_MESSAGE.INVALID_QUOTE_AUTHOR)
    .bail()
    .trim()
    .isLength({ min: QUOTE_AUTHOR_MIN_LENGTH, max: QUOTE_AUTHOR_MAX_LENGTH })
    .withMessage(ERROR_MESSAGE.INVALID_QUOTE_AUTHOR)
}

function quoteCategoriesBodyValidator({ optional = false } = {}) {
  const validator = body('categories')

  if (optional) validator.optional()

  return validator
    .isArray({ min: 1 })
    .withMessage(ERROR_MESSAGE.INVALID_QUOTE_CATEGORIES)
    .bail()
    .customSanitizer(removeDuplicateCategories)
    .isArray({ max: MAX_CATEGORIES_PER_QUOTE })
    .withMessage(ERROR_MESSAGE.INVALID_QUOTE_CATEGORIES)
}

function quoteCategoryItemBodyValidator({ optional = false } = {}) {
  const validator = body('categories.*')

  if (optional) validator.optional()

  return categoryNameValidator(validator)
}

function quotePatchBodyValidator() {
  return body()
    .custom((quote = {}) => {
      const hasQuoteField = QUOTE_PATCH_FIELDS.some(
        (field) => quote[field] !== undefined,
      )

      return hasQuoteField
    })
    .withMessage(ERROR_MESSAGE.NOTHING_TO_UPDATE)
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
    .withMessage(ERROR_MESSAGE.INVALID_RANDOM_LIMIT)
    .toInt(),
]

export const postQuoteValidators = [
  quoteTextBodyValidator(),
  quoteAuthorBodyValidator(),
  quoteCategoryItemBodyValidator(),
  quoteCategoriesBodyValidator(),
]

export const getSingleQuoteValidators = [idParamValidator()]

export const deleteSingleQuoteValidators = [idParamValidator()]

export const patchSingleQuoteValidators = [
  idParamValidator(),
  quotePatchBodyValidator(),
  quoteTextBodyValidator({ optional: true }),
  quoteAuthorBodyValidator({ optional: true }),
  quoteCategoryItemBodyValidator({ optional: true }),
  quoteCategoriesBodyValidator({ optional: true }),
]
