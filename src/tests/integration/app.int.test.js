import { describe, expect, test } from 'vitest'
import { client } from './helpers.js'
import {
  API_INFO,
  ERROR_CODE,
  ERROR_MESSAGE,
  HEALTH_STATUS,
  HTTP_STATUS,
  ROUTE,
} from '#constants'

describe('App (integration)', () => {
  test('GET / answers the API info', async () => {
    const response = await client.get(ROUTE.ROOT)

    expect(response.status).toBe(HTTP_STATUS.OK)
    expect(response.body).toEqual(API_INFO)
  })

  test('GET /health answers 200 while the database is available', async () => {
    const response = await client.get(ROUTE.HEALTH)

    expect(response.status).toBe(HTTP_STATUS.OK)
    expect(response.body).toEqual(HEALTH_STATUS.OK)
  })

  test('answers 404 in the error shape for an unknown route', async () => {
    const response = await client.get('/unknown')

    expect(response.status).toBe(HTTP_STATUS.NOT_FOUND)
    expect(response.body).toEqual({
      error: {
        code: ERROR_CODE.NOT_FOUND,
        message: ERROR_MESSAGE.ROUTE_NOT_FOUND('GET', '/unknown'),
      },
    })
  })

  test('answers 400 for an invalid JSON body', async () => {
    const response = await client
      .post(ROUTE.QUOTES)
      .set('Content-Type', 'application/json')
      .send('{"text": ')

    expect(response.status).toBe(HTTP_STATUS.BAD_REQUEST)
    expect(response.body).toEqual({
      error: { code: ERROR_CODE.INVALID_JSON, message: ERROR_MESSAGE.INVALID_JSON },
    })
  })
})
