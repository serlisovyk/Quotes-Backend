import { beforeEach, describe, expect, test, vi } from 'vitest'
import sequelize from '../../../database/db.js'
import Logger from '../../../logger/logger.service.js'
import closeDatabaseConnection from './index.js'

vi.mock('../../../database/db.js', () => ({
  default: {
    close: vi.fn(),
  },
}))

vi.mock('../../../logger/logger.service.js', () => ({
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
