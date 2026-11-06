import { MAX_LIST_LIMIT, MAX_RANDOM_QUOTES_LIMIT } from './app.constant.js'
import {
  MAX_ENTITY_ID,
  QUOTE_AUTHOR_MAX_LENGTH,
  QUOTE_AUTHOR_MIN_LENGTH,
  QUOTE_TEXT_MIN_LENGTH,
} from './validation.constant.js'

export const ERROR_CODE = {
  BAD_REQUEST: 'BAD_REQUEST',
  INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',
  INVALID_JSON: 'INVALID_JSON',
  NOT_FOUND: 'NOT_FOUND',
  PAYLOAD_TOO_LARGE: 'PAYLOAD_TOO_LARGE',
  TOO_MANY_REQUESTS: 'TOO_MANY_REQUESTS',
  UNSUPPORTED_MEDIA_TYPE: 'UNSUPPORTED_MEDIA_TYPE',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
}

export const BODY_PARSER_ERROR_TYPE = {
  ENTITY_TOO_LARGE: 'entity.too.large',
  CHARSET_UNSUPPORTED: 'charset.unsupported',
  ENCODING_UNSUPPORTED: 'encoding.unsupported',
}

export const ERROR_MESSAGE = {
  INTERNAL_SERVER_ERROR: 'Internal server error',
  INVALID_JSON: 'Invalid JSON',
  INVALID_REQUEST_DATA: 'Invalid request data',
  PAYLOAD_TOO_LARGE: 'Payload too large',
  UNSUPPORTED_MEDIA_TYPE: 'Unsupported media type',
  TOO_MANY_REQUESTS: 'Too many requests, please try again later',
  QUOTE_NOT_FOUND: (id) => `Quote with ID ${id} not found`,
  CATEGORY_NOT_FOUND: (id) => `Category with ID ${id} not found`,
  ROUTE_NOT_FOUND: (method, url) => `Route ${method} ${url} not found`,
  INVALID_CATEGORY_NAME:
    'Category can only contain lowercase letters, numbers and dashes',
  INVALID_CATEGORY_SEARCH: 'Category can only contain letters, numbers and dashes',
  INVALID_ENTITY_ID: `ID must be integer in the range from 1 to ${MAX_ENTITY_ID}`,
  INVALID_LIST_LIMIT: `Limit must be in range 1..${MAX_LIST_LIMIT}`,
  INVALID_RANDOM_LIMIT: `Limit must be in range 1..${MAX_RANDOM_QUOTES_LIMIT}`,
  INVALID_OFFSET: 'Offset must be an integer, 0 or more',
  INVALID_QUOTE_TEXT: `Text must be a string of at least ${QUOTE_TEXT_MIN_LENGTH} characters`,
  INVALID_QUOTE_AUTHOR: `Author must be a string from ${QUOTE_AUTHOR_MIN_LENGTH} to ${QUOTE_AUTHOR_MAX_LENGTH} characters`,
  INVALID_QUOTE_CATEGORIES: 'Categories must be an array with at least one category',
  NOTHING_TO_UPDATE: 'Nothing to update',
}
