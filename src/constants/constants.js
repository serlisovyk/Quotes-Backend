export const DEFAULT_QUOTES_LIMIT = 10

export const RANDOM_QUOTES_LIMIT = 10

export const DEFAULT_CATEGORIES_LIMIT = 10

export const DEFAULT_OFFSET = 0

export const MAX_LIST_LIMIT = 50

export const MAX_RANDOM_QUOTES_LIMIT = 20

export const MAX_ENTITY_ID = 2147483647

export const MINUTES_IN_MS = {
  FIFTEEN: 15 * 60 * 1000,
}

export const RATE_LIMIT_MAX_REQUESTS = 100

export const ERROR_CODE = {
  BAD_REQUEST: 'BAD_REQUEST',
  INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',
  INVALID_JSON: 'INVALID_JSON',
  NOT_FOUND: 'NOT_FOUND',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
}

export const ERROR_MESSAGE = {
  INTERNAL_SERVER_ERROR: 'Internal server error',
  INVALID_JSON: 'Invalid JSON',
  INVALID_REQUEST_DATA: 'Invalid request data',
  QUOTE_NOT_FOUND: (id) => `Quote with ID ${id} not found`,
  CATEGORY_NOT_FOUND: (id) => `Category with ID ${id} not found`,
  ROUTE_NOT_FOUND: (method, url) => `Route ${method} ${url} not found`,
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
