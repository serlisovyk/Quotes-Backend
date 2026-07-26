import { beforeEach, describe, expect, test, vi } from 'vitest'
import sequelize from '#database'
import Logger from '#logger'
import syncDatabase from '#utils/database/sync-database'

vi.mock('#database', () => ({
  default: {
    sync: vi.fn(),
  },
}))

vi.mock('#models/associations', () => ({}))

vi.mock('#logger', () => ({
  default: {
    error: vi.fn(),
    success: vi.fn(),
  },
}))

describe('SyncDatabase Util', () => {
  beforeEach(() => vi.clearAllMocks())

  test('syncs database and logs success', async () => {
    sequelize.sync.mockResolvedValue()

    await syncDatabase()

    expect(sequelize.sync).toHaveBeenCalled()
    expect(Logger.success).toHaveBeenCalledWith('Database synchronized')
  })

  test('logs and rethrows sync errors', async () => {
    const error = new Error('Failed')

    sequelize.sync.mockRejectedValue(error)

    await expect(syncDatabase()).rejects.toBe(error)
    expect(Logger.error).toHaveBeenCalledWith('Unable to sync database', error)
  })
})
