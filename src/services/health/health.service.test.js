import { beforeEach, describe, expect, test, vi } from 'vitest'
import sequelize from '#database'
import Logger from '#logger'
import { isDatabaseAvailable } from '#services/health'

vi.mock('#database', () => ({
  default: { authenticate: vi.fn() },
}))

vi.mock('#logger', () => ({
  default: { warn: vi.fn() },
}))

describe('Health Service', () => {
  beforeEach(() => vi.clearAllMocks())

  test('returns true when the database authenticates', async () => {
    sequelize.authenticate.mockResolvedValue()

    expect(await isDatabaseAvailable()).toBe(true)
    expect(Logger.warn).not.toHaveBeenCalled()
  })

  test('returns false and logs a warning when the database is unreachable', async () => {
    sequelize.authenticate.mockRejectedValue(new Error('connect ECONNREFUSED'))

    expect(await isDatabaseAvailable()).toBe(false)
    expect(Logger.warn).toHaveBeenCalledWith(
      'Database health check failed: connect ECONNREFUSED',
    )
  })
})
