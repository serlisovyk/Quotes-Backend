export const DEFAULT_QUOTES_LIMIT = 10

export const RANDOM_QUOTES_LIMIT = 10

export const DEFAULT_CATEGORIES_LIMIT = 10

export const DEFAULT_OFFSET = 0

export const DEFAULT_QUOTE_SORT = 'id'

export const DEFAULT_SORT_ORDER = 'asc'

export const MAX_LIST_LIMIT = 50

export const MAX_RANDOM_QUOTES_LIMIT = 20

export const MINUTES_IN_MS = {
  FIFTEEN: 15 * 60 * 1000,
}

export const RATE_LIMIT_MAX_REQUESTS = 100
export const WRITE_RATE_LIMIT_MAX_REQUESTS = 20

export const JSON_BODY_LIMIT = '50kb'

export const TRUST_PROXY_HOPS = 1

export const SHUTDOWN_TIMEOUT_MS = 10 * 1000

export const CACHE_MAX_AGE_SECONDS = 60

export const HEADER = {
  CACHE_CONTROL: 'Cache-Control',
}

export const CACHE_CONTROL = {
  PUBLIC_SHORT: `public, max-age=${CACHE_MAX_AGE_SECONDS}`,
  NO_STORE: 'no-store',
}

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  PAYLOAD_TOO_LARGE: 413,
  UNSUPPORTED_MEDIA_TYPE: 415,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
}

export const ROUTE = {
  ROOT: '/',
  HEALTH: '/health',
  QUOTES: '/quotes',
  CATEGORIES: '/categories',
}

export const SKIPPED_REQUEST_LOG_ROUTES = [ROUTE.ROOT, ROUTE.HEALTH]

export const ROUTER_PATH = {
  ROOT: '/',
  ID: '/:id',
  RANDOM: '/random',
}

export const HEALTH_STATUS = {
  OK: { status: 'ok', database: 'ok' },
  ERROR: { status: 'error', database: 'unavailable' },
}

const QUOTE_PATH = `${ROUTE.QUOTES}${ROUTER_PATH.ID}`
const CATEGORY_PATH = `${ROUTE.CATEGORIES}${ROUTER_PATH.ID}`

export const API_INFO = {
  name: 'Quotes API',
  message: 'Welcome to the Quotes API',
  description:
    'REST API for quotes and categories: listing with pagination and search, random quotes, CRUD for quotes.',
  repository: 'https://github.com/serlisovyk/Quotes-Backend',
  endpoints: [
    { method: 'GET', path: ROUTE.HEALTH },
    { method: 'GET', path: ROUTE.QUOTES },
    { method: 'GET', path: `${ROUTE.QUOTES}${ROUTER_PATH.RANDOM}` },
    { method: 'GET', path: QUOTE_PATH },
    { method: 'POST', path: ROUTE.QUOTES },
    { method: 'PATCH', path: QUOTE_PATH },
    { method: 'DELETE', path: QUOTE_PATH },
    { method: 'GET', path: ROUTE.CATEGORIES },
    { method: 'GET', path: CATEGORY_PATH },
  ],
}
