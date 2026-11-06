import { beforeEach, describe, expect, test, vi } from 'vitest'
import { Category, Quote } from '#models'
import Logger from '#logger'
import resetSequence from '#utils/database/reset-sequence'
import resetIdSequences from '#utils/database/reset-id-sequences'

vi.mock('#models', () => ({
  Category: { tableName: 'Categories' },
  Quote: { tableName: 'Quotes' },
}))

vi.mock('#logger', () => ({
  default: {
    error: vi.fn(),
    success: vi.fn(),
  },
}))

vi.mock('#utils/database/reset-sequence', () => ({
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
