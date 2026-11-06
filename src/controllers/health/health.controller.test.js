import { beforeEach, describe, expect, test, vi } from 'vitest'
import { createResponseMock } from '#tests/mocks/response'
import { getHealth } from '#controllers/health'
import * as HealthService from '#services/health'
import { HEALTH_STATUS, HTTP_STATUS } from '#constants'

vi.mock('#services/health', () => ({
  isDatabaseAvailable: vi.fn(),
}))

describe('Health Controller', () => {
  beforeEach(() => vi.clearAllMocks())

  test('answers 200 when the database is available', async () => {
    const res = createResponseMock()

    HealthService.isDatabaseAvailable.mockResolvedValue(true)

    await getHealth({}, res)

    expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.OK)
    expect(res.json).toHaveBeenCalledWith(HEALTH_STATUS.OK)
  })

  test('answers 503 when the database is unavailable', async () => {
    const res = createResponseMock()

    HealthService.isDatabaseAvailable.mockResolvedValue(false)

    await getHealth({}, res)

    expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.SERVICE_UNAVAILABLE)
    expect(res.json).toHaveBeenCalledWith(HEALTH_STATUS.ERROR)
  })
})
