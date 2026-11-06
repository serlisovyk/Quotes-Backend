import request from 'supertest'
import { ConnectionError } from 'sequelize'
import { beforeEach, describe, expect, test, vi } from 'vitest'
import Logger from '#logger'
import * as QuotesService from '#services/quotes'
import * as CategoriesService from '#services/categories'
import * as HealthService from '#services/health'
import {
  API_INFO,
  CACHE_CONTROL,
  ERROR_CODE,
  ERROR_MESSAGE,
  HEADER,
  HTTP_STATUS,
  JSON_BODY_LIMIT,
  ROUTE,
} from '#constants'
import app from './app.js'

vi.hoisted(() => {
  process.env.DATABASE_URL = 'postgres://user:pass@localhost:5432/db'
  process.env.DB_DIALECT = 'postgres'
})

vi.mock('#logger', () => ({
  default: {
    error: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    success: vi.fn(),
  },
}))

vi.mock('#services/quotes', () => ({
  findQuotes: vi.fn(),
  findRandomQuotes: vi.fn(),
  findSingleQuote: vi.fn(),
  deleteSingleQuote: vi.fn(),
}))

vi.mock('#services/categories', () => ({
  findCategories: vi.fn(),
  findSingleCategory: vi.fn(),
}))

vi.mock('#services/health', () => ({
  isDatabaseAvailable: vi.fn(),
}))

const BYTES_IN_KILOBYTE = 1024
const LIMIT_BYTES = parseInt(JSON_BODY_LIMIT) * BYTES_IN_KILOBYTE

describe('App body parsing errors', () => {
  test('answers 413 for a body over the JSON limit without logging an error', async () => {
    const body = JSON.stringify({ text: 'a'.repeat(LIMIT_BYTES + 1) })

    const res = await request(app)
      .post(ROUTE.QUOTES)
      .set('Content-Type', 'application/json')
      .send(body)

    expect(res.status).toBe(HTTP_STATUS.PAYLOAD_TOO_LARGE)
    expect(res.body).toEqual({
      error: {
        code: ERROR_CODE.PAYLOAD_TOO_LARGE,
        message: ERROR_MESSAGE.PAYLOAD_TOO_LARGE,
      },
    })
    expect(Logger.error).not.toHaveBeenCalled()
  })

  test('answers 415 for an unsupported charset without logging an error', async () => {
    const res = await request(app)
      .post(ROUTE.QUOTES)
      .set('Content-Type', 'application/json; charset=koi8-r')
      .send('{"text":"a"}')

    expect(res.status).toBe(HTTP_STATUS.UNSUPPORTED_MEDIA_TYPE)
    expect(res.body).toEqual({
      error: {
        code: ERROR_CODE.UNSUPPORTED_MEDIA_TYPE,
        message: ERROR_MESSAGE.UNSUPPORTED_MEDIA_TYPE,
      },
    })
    expect(Logger.error).not.toHaveBeenCalled()
  })

  test('still answers 400 INVALID_JSON for malformed JSON', async () => {
    const res = await request(app)
      .post(ROUTE.QUOTES)
      .set('Content-Type', 'application/json')
      .send('{"text":')

    expect(res.status).toBe(HTTP_STATUS.BAD_REQUEST)
    expect(res.body.error.code).toBe(ERROR_CODE.INVALID_JSON)
    expect(Logger.error).not.toHaveBeenCalled()
  })
})

describe('App root', () => {
  test('answers 200 with the welcome message and the endpoints', async () => {
    const res = await request(app).get(ROUTE.ROOT)

    expect(res.status).toBe(HTTP_STATUS.OK)
    expect(res.body.message).toBe(API_INFO.message)
    expect(res.body.endpoints).toEqual(API_INFO.endpoints)
  })
})

describe('App cache headers', () => {
  const quote = { id: 1, text: 'Text', author: 'Author', categories: [] }
  const category = { id: 1, name: 'life' }

  beforeEach(() => {
    QuotesService.findQuotes.mockResolvedValue({ total: 1, quotes: [quote] })
    QuotesService.findRandomQuotes.mockResolvedValue([quote])
    QuotesService.findSingleQuote.mockResolvedValue(quote)
    CategoriesService.findCategories.mockResolvedValue({
      total: 1,
      categories: [category],
    })
    CategoriesService.findSingleCategory.mockResolvedValue(category)
    HealthService.isDatabaseAvailable.mockResolvedValue(true)
  })

  test.each([
    [ROUTE.ROOT],
    [ROUTE.QUOTES],
    [`${ROUTE.QUOTES}/1`],
    [ROUTE.CATEGORIES],
    [`${ROUTE.CATEGORIES}/1`],
  ])('GET %s is cached for a short time', async (path) => {
    const res = await request(app).get(path)

    expect(res.status).toBe(HTTP_STATUS.OK)
    expect(res.headers['cache-control']).toBe(CACHE_CONTROL.PUBLIC_SHORT)
    expect(res.headers.etag).toBeDefined()
  })

  test.each([[`${ROUTE.QUOTES}/random`], [ROUTE.HEALTH]])(
    'GET %s is not stored',
    async (path) => {
      const res = await request(app).get(path)

      expect(res.status).toBe(HTTP_STATUS.OK)
      expect(res.headers['cache-control']).toBe(CACHE_CONTROL.NO_STORE)
    },
  )

  test('GET /health is not stored while the database is down', async () => {
    HealthService.isDatabaseAvailable.mockResolvedValue(false)

    const res = await request(app).get(ROUTE.HEALTH)

    expect(res.status).toBe(HTTP_STATUS.SERVICE_UNAVAILABLE)
    expect(res.headers['cache-control']).toBe(CACHE_CONTROL.NO_STORE)
  })

  test.each([
    ['a missing quote', `${ROUTE.QUOTES}/1`, HTTP_STATUS.NOT_FOUND],
    ['an invalid id', `${ROUTE.QUOTES}/abc`, HTTP_STATUS.BAD_REQUEST],
    ['an invalid limit', `${ROUTE.QUOTES}?limit=0`, HTTP_STATUS.BAD_REQUEST],
    ['an unknown route', '/missing', HTTP_STATUS.NOT_FOUND],
  ])('an error for %s is not stored', async (_, path, status) => {
    QuotesService.findSingleQuote.mockResolvedValue(null)

    const res = await request(app).get(path)

    expect(res.status).toBe(status)
    expect(res.headers['cache-control']).toBe(CACHE_CONTROL.NO_STORE)
  })

  test('a 503 from a read route is not stored', async () => {
    QuotesService.findQuotes.mockRejectedValue(
      new ConnectionError(new Error('refused')),
    )

    const res = await request(app).get(ROUTE.QUOTES)

    expect(res.status).toBe(HTTP_STATUS.SERVICE_UNAVAILABLE)
    expect(res.headers['cache-control']).toBe(CACHE_CONTROL.NO_STORE)
  })

  test('a successful write has no Cache-Control', async () => {
    QuotesService.deleteSingleQuote.mockResolvedValue(true)

    const res = await request(app).delete(`${ROUTE.QUOTES}/1`)

    expect(res.status).toBe(HTTP_STATUS.NO_CONTENT)
    expect(res.headers[HEADER.CACHE_CONTROL.toLowerCase()]).toBeUndefined()
  })
})

describe('App compression', () => {
  const bigPage = {
    total: 50,
    quotes: Array.from({ length: 50 }, (_, index) => ({
      id: index + 1,
      text: 'A quote long enough to make the list worth compressing',
      author: 'Author',
      categories: ['life'],
    })),
  }

  test('gzips a large response when the client accepts it', async () => {
    QuotesService.findQuotes.mockResolvedValue(bigPage)

    const res = await request(app).get(ROUTE.QUOTES).set('Accept-Encoding', 'gzip')

    expect(res.headers['content-encoding']).toBe('gzip')
    expect(res.headers.vary).toContain('Accept-Encoding')
    expect(res.headers['cache-control']).toBe(CACHE_CONTROL.PUBLIC_SHORT)
    expect(res.body).toEqual(bigPage)
  })

  test('does not compress without Accept-Encoding', async () => {
    QuotesService.findQuotes.mockResolvedValue(bigPage)

    const res = await request(app)
      .get(ROUTE.QUOTES)
      .set('Accept-Encoding', 'identity')

    expect(res.headers['content-encoding']).toBeUndefined()
  })

  test('leaves a response under the threshold plain', async () => {
    const res = await request(app).get(ROUTE.HEALTH).set('Accept-Encoding', 'gzip')

    expect(res.headers['content-encoding']).toBeUndefined()
  })
})
