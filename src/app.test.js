import request from 'supertest'
import { describe, expect, test, vi } from 'vitest'
import Logger from '#logger'
import {
  ERROR_CODE,
  ERROR_MESSAGE,
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
  },
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
