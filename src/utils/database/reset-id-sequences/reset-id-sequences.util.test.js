import { beforeEach, describe, expect, test, vi } from 'vitest'
import Category from '../../../database/models/category.model.js'
import Quote from '../../../database/models/quote.model.js'
import Logger from '../../../logger/logger.service.js'
import resetIdSequences from './index.js'
import resetSequence from '../reset-sequence/index.js'

vi.mock('../../../database/models/category.model.js', () => ({
  default: { tableName: 'Categories' },
}))

vi.mock('../../../database/models/quote.model.js', () => ({
  default: { tableName: 'Quotes' },
}))

vi.mock('../../../logger/logger.service.js', () => ({
  default: {
    error: vi.fn(),
    success: vi.fn(),
  },
}))

vi.mock('../reset-sequence/index.js', () => ({
  default: vi.fn(),
}))

describe('ResetIdSequences Util', () => {
  beforeEach(() => vi.clearAllMocks())

  test('resets quote and category sequences', async () => {
    resetSequence.mockResolvedValue()

    await resetIdSequences()

    expect(resetSequence).toHaveBeenNthCalledWith(1, Quote, 'Quotes_id_seq')
    expect(resetSequence).toHaveBeenNthCalledWith(2, Category, 'Categories_id_seq')
    expect(Logger.success).toHaveBeenCalledWith(
      'Quotes and Categories ID Sequences reset',
    )
  })

  test('logs and rethrows reset errors', async () => {
    const error = new Error('Failed')

    resetSequence.mockRejectedValue(error)

    await expect(resetIdSequences()).rejects.toBe(error)
    expect(Logger.error).toHaveBeenCalledWith('Unable to reset ID sequences', error)
  })
})
