import { beforeEach, describe, expect, test, vi } from 'vitest'
import sequelize from '#database'
import Logger from '#logger'
import closeDatabaseConnection from '#utils/database/close-database-connection'

vi.mock('#database', () => ({
  default: {
    close: vi.fn(),
  },
}))

vi.mock('#logger', () => ({
  default: {
    success: vi.fn(),
  },
}))

describe('CloseDatabaseConnection Util', () => {
  beforeEach(() => vi.clearAllMocks())

  test('closes sequelize connection and logs success', async () => {
    sequelize.close.mockResolvedValue()

    await closeDatabaseConnection()

    expect(sequelize.close).toHaveBeenCalled()
    expect(Logger.success).toHaveBeenCalledWith('Database connection closed')
  })
})
