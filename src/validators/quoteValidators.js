import { query, param, body } from 'express-validator'
import { CATEGORY_NAME_REGEX } from '../constants/constants.js'

export const getQuotesValidators = [
  query('limit')
    .optional()
    .trim()
    .isInt({ min: 1, max: 50 })
    .withMessage('Limit must be in range 1..50'),
  query('offset').optional().trim().isInt({ min: 0 }),
  query('author').optional().trim().escape(),
  query('text').optional().trim().escape(),
  query('category')
    .optional()
    .trim()
    .escape()
    .custom((value) =>
      CATEGORY_NAME_REGEX.test(value)
        ? Promise.resolve()
        : Promise.reject(
            'Category can only contain lowercase letters, numbers and dashes'
          )
    ),
]

export const getRandomQuotesValidators = [
  query('limit').optional().trim().isInt({ min: 1, max: 20 }),
]

export const postQuoteValidators = [
  body('text')
    .trim()
    .isString()
    .isLength({ min: 10 })
    .withMessage('Text is required and has to be minimum 10 characters'),
  body('author')
    .trim()
    .isString()
    .isLength({ min: 2, max: 255 })
    .withMessage('Author must be a string from 2 to 255 characters'),
  body('categories')
    .isArray({ min: 1 })
    .withMessage('Categories must be an array with at least one category'),
  body('categories.*')
    .trim()
    .matches(CATEGORY_NAME_REGEX)
    .withMessage(
      'Each category must contain only lowercase letters, numbers and dashes'
    ),
]

const quoteIdParamValidator = param('id')
  .trim()
  .isInt({ min: 1, max: 2147483647 })
  .withMessage('Quote ID must be integer in the range from 1 to 2147483647')

export const getSingleQuoteValidators = [quoteIdParamValidator]

export const deleteSingleQuoteValidators = [quoteIdParamValidator]

export const patchSingleQuoteValidators = [
  quoteIdParamValidator,
  body('text')
    .optional()
    .trim()
    .isString()
    .isLength({ min: 10 })
    .withMessage('Text has to be minimum 10 characters'),
  body('author')
    .optional()
    .trim()
    .isString()
    .isLength({ min: 2, max: 255 })
    .withMessage('Author must be a string from 2 to 255 characters'),
  body('categories').optional().isArray({ min: 1 }),
  body('categories.*')
    .optional()
    .trim()
    .matches(CATEGORY_NAME_REGEX)
    .withMessage(
      'Each category must contain only lowercase letters, numbers, and dashes'
    ),
]
