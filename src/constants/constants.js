export const attributes = { exclude: ['createdAt', 'updatedAt'] }

export const getQuoteNotFoundErrorMessage = (id) => `Quote with ID ${id} not found`

export const DEFAULT_QUOTES_LIMIT = 10

export const RANDOM_QUOTES_LIMIT = 10

export const DEFAULT_CATEGORIES_LIMIT = 10

export const MAX_LIST_LIMIT = 50

export const MAX_RANDOM_QUOTES_LIMIT = 20

export const MAX_ENTITY_ID = 2147483647

export const MINUTES_IN_MS = {
  FIFTEEN: 15 * 60 * 1000,
}

export const RATE_LIMIT_MAX_REQUESTS = 100

export const ERROR_CODE = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
}

export const ERROR_MESSAGE = {
  INVALID_REQUEST_DATA: 'Invalid request data',
  INVALID_CATEGORY_NAME:
    'Category can only contain lowercase letters, numbers and dashes',
  INVALID_CATEGORY_SEARCH: 'Category can only contain letters, numbers and dashes',
  INVALID_ENTITY_ID: `ID must be integer in the range from 1 to ${MAX_ENTITY_ID}`,
  INVALID_LIST_LIMIT: `Limit must be in range 1..${MAX_LIST_LIMIT}`,
}

export const VALIDATION_ROOT_FIELD = '_root'

// Allows lowercase letters, numbers and dashes
export const CATEGORY_NAME_REGEX = /^[a-z0-9\-]+$/

// Allows any letters, numbers and dashes
export const CATEGORY_NAME_I_REGEX = /^[a-z0-9\-]+$/i
