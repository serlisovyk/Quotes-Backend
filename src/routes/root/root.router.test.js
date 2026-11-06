import { describe, expect, test } from 'vitest'
import { createRouterTestClientFactory } from '#tests/utils/router-test-client'
import rootRouter from '#routes/root'
import { API_INFO, HTTP_STATUS, ROUTE } from '#constants'

const requestRootRouter = createRouterTestClientFactory({
  route: ROUTE.ROOT,
  router: rootRouter,
  useErrorMiddleware: false,
  useJsonParser: false,
})

describe('Root Router', () => {
  test('answers the welcome message with the endpoints', async () => {
    const response = await requestRootRouter().get(ROUTE.ROOT)

    expect(response.status).toBe(HTTP_STATUS.OK)
    expect(response.body).toEqual(API_INFO)
    expect(response.body.endpoints).toContainEqual({
      method: 'GET',
      path: '/quotes/random',
    })
  })
})
