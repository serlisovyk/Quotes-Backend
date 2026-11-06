import { beforeEach, describe, expect, test, vi } from 'vitest'
import { createRouterTestClientFactory } from '#tests/utils/router-test-client'
import healthRouter from '#routes/health'
import * as HealthService from '#services/health'
import { HEALTH_STATUS, HTTP_STATUS, ROUTE } from '#constants'

vi.mock('#services/health', () => ({
  isDatabaseAvailable: vi.fn(),
}))

const requestHealthRouter = createRouterTestClientFactory({
  route: ROUTE.HEALTH,
  router: healthRouter,
  useJsonParser: false,
})

describe('Health Router', () => {
  beforeEach(() => vi.clearAllMocks())

  test('answers 200 with the database status', async () => {
    HealthService.isDatabaseAvailable.mockResolvedValue(true)

    const response = await requestHealthRouter().get(ROUTE.HEALTH)

    expect(response.status).toBe(HTTP_STATUS.OK)
    expect(response.body).toEqual(HEALTH_STATUS.OK)
  })

  test('answers 503 when the database is unavailable', async () => {
    HealthService.isDatabaseAvailable.mockResolvedValue(false)

    const response = await requestHealthRouter().get(ROUTE.HEALTH)

    expect(response.status).toBe(HTTP_STATUS.SERVICE_UNAVAILABLE)
    expect(response.body).toEqual(HEALTH_STATUS.ERROR)
  })
})
