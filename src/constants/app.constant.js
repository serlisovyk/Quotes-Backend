export const DEFAULT_QUOTES_LIMIT = 10

export const RANDOM_QUOTES_LIMIT = 10

export const DEFAULT_CATEGORIES_LIMIT = 10

export const DEFAULT_OFFSET = 0

export const MAX_LIST_LIMIT = 50

export const MAX_RANDOM_QUOTES_LIMIT = 20

export const MINUTES_IN_MS = {
  FIFTEEN: 15 * 60 * 1000,
}

export const RATE_LIMIT_MAX_REQUESTS = 100

export const JSON_BODY_LIMIT = '50kb'

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
}

export const ROUTE = {
  HEALTH: '/health',
  QUOTES: '/quotes',
  CATEGORIES: '/categories',
}

export const SKIPPED_REQUEST_LOG_ROUTES = [ROUTE.HEALTH]

export const ROUTER_PATH = {
  ROOT: '/',
  ID: '/:id',
  RANDOM: '/random',
}
