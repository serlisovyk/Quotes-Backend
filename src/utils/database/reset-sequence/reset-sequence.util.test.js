import { beforeEach, describe, expect, test, vi } from 'vitest'
import sequelize from '../../../database/db.js'
import Logger from '../../../logger/logger.service.js'
import resetSequence from './index.js'

vi.mock('../../../database/db.js', () => ({
  default: {
    query: vi.fn(),
  },
}))

vi.mock('../../../logger/logger.service.js', () => ({
  default: {
    info: vi.fn(),
  },
}))

describe('ResetSequence Util', () => {
  beforeEach(() => vi.clearAllMocks())

  test('resets sequence to current max id', async () => {
    const model = {
      max: vi.fn().mockResolvedValue(12),
      tableName: 'Quotes',
    }

    await resetSequence(model, 'Quotes_id_seq')

    expect(model.max).toHaveBeenCalledWith('id')
    expect(sequelize.query).toHaveBeenCalledWith(
      'SELECT setval(\'"Quotes_id_seq"\', 12);',
    )
    expect(Logger.info).not.toHaveBeenCalled()
  })

  test('skips reset when table is empty', async () => {
    const model = {
      max: vi.fn().mockResolvedValue(null),
      tableName: 'Quotes',
    }

    await resetSequence(model, 'Quotes_id_seq')

    expect(sequelize.query).not.toHaveBeenCalled()
    expect(Logger.info).toHaveBeenCalledWith(
      'Skipping sequence reset for Quotes: table is empty',
    )
  })
})
