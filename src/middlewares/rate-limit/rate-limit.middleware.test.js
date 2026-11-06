import { describe, expect, test } from 'vitest'
import express from 'express'
import request from 'supertest'
import errorMiddleware from '#middlewares/error'
import { createRateLimiter } from '#middlewares/rate-limit'
import { ERROR_CODE, ERROR_MESSAGE, HTTP_STATUS, ROUTE } from '#constants'

const TEST_LIMIT = 2
const TEST_WINDOW_MS = 60 * 1000

function createTestClient() {
  const app = express()
  const generalLimiter = createRateLimiter({ windowMs: TEST_WINDOW_MS, limit: 100 })
  const writeLimiter = createRateLimiter({
    windowMs: TEST_WINDOW_MS,
    limit: TEST_LIMIT,
  })

  app.use(generalLimiter)
  app.get(ROUTE.QUOTES, (_req, res) => res.status(HTTP_STATUS.OK).json({}))
  app.post(ROUTE.QUOTES, writeLimiter, (_req, res) =>
    res.status(HTTP_STATUS.CREATED).json({}),
  )
  app.use(errorMiddleware)

  return request(app)
}

async function sendWrites(client, count) {
  const responses = []

  for (let index = 0; index < count; index += 1) {
    responses.push(await client.post(ROUTE.QUOTES))
  }

  return responses
}

describe('Rate Limit Middleware', () => {
  test('allows requests up to the limit', async () => {
    const client = createTestClient()

    const responses = await sendWrites(client, TEST_LIMIT)

    responses.forEach(({ status }) => expect(status).toBe(HTTP_STATUS.CREATED))
  })

  test('answers 429 in the API error shape over the limit', async () => {
    const client = createTestClient()

    const [, , limited] = await sendWrites(client, TEST_LIMIT + 1)

    expect(limited.status).toBe(HTTP_STATUS.TOO_MANY_REQUESTS)
    expect(limited.body).toEqual({
      error: {
        code: ERROR_CODE.TOO_MANY_REQUESTS,
        message: ERROR_MESSAGE.TOO_MANY_REQUESTS,
      },
    })
  })

  test('sends standard rate limit headers without legacy ones', async () => {
    const client = createTestClient()

    const [first] = await sendWrites(client, 1)

    expect(first.headers['ratelimit-limit']).toBe(String(TEST_LIMIT))
    expect(first.headers['ratelimit-remaining']).toBe(String(TEST_LIMIT - 1))
    expect(first.headers['ratelimit-reset']).toBeDefined()
    expect(first.headers['x-ratelimit-limit']).toBeUndefined()
  })

  test('keeps reads available after writes are limited', async () => {
    const client = createTestClient()

    await sendWrites(client, TEST_LIMIT + 1)
    const response = await client.get(ROUTE.QUOTES)

    expect(response.status).toBe(HTTP_STATUS.OK)
  })

  test('answers 429 in the API error shape from the general limiter', async () => {
    const app = express()

    app.use(createRateLimiter({ windowMs: TEST_WINDOW_MS, limit: 1 }))
    app.get(ROUTE.QUOTES, (_req, res) => res.status(HTTP_STATUS.OK).json({}))
    app.use(errorMiddleware)

    const client = request(app)
    await client.get(ROUTE.QUOTES)
    const limited = await client.get(ROUTE.QUOTES)

    expect(limited.status).toBe(HTTP_STATUS.TOO_MANY_REQUESTS)
    expect(limited.body.error.code).toBe(ERROR_CODE.TOO_MANY_REQUESTS)
  })
})
