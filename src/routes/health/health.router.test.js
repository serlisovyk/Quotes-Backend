import { describe, expect, test } from 'vitest'
import { createRouterTestClientFactory } from '#tests/utils/router-test-client'
import { HTTP_STATUS, ROUTE } from '#constants/app.constant'
import healthRouter from '#routes/health'

const requestHealthRouter = createRouterTestClientFactory({
  route: ROUTE.HEALTH,
  router: healthRouter,
  useErrorMiddleware: false,
  useJsonParser: false,
})

describe('Health Router', () => {
  test('handles health endpoint', async () => {
    const response = await requestHealthRouter().get(ROUTE.HEALTH)

    expect(response.status).toBe(HTTP_STATUS.OK)
    expect(response.body).toEqual({ status: 'ok' })
  })
})
