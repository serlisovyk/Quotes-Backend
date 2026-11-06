import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'

const mocks = vi.hoisted(() => ({
  quoteCategoryFindAll: vi.fn(),
  categoryDestroy: vi.fn(),
  quoteFindAll: vi.fn(),
  quoteDestroy: vi.fn(),
  closeDatabaseConnection: vi.fn(),
}))

vi.mock('sequelize', () => ({ Op: { lte: 'lte' } }))

vi.mock('#database', () => ({
  default: { where: vi.fn(), fn: vi.fn(), col: vi.fn() },
}))

vi.mock('#models', () => ({
  Category: { destroy: mocks.categoryDestroy },
  Quote: { findAll: mocks.quoteFindAll, destroy: mocks.quoteDestroy },
  QuoteCategory: { findAll: mocks.quoteCategoryFindAll },
}))

vi.mock('#logger', () => ({
  default: { info: vi.fn(), success: vi.fn(), error: vi.fn() },
}))

vi.mock('#utils/database/close-database-connection', () => ({
  default: mocks.closeDatabaseConnection,
}))

const runScript = async () => {
  vi.resetModules()
  await import('./remove-rare-categories.seed.js')
  await vi.waitFor(() =>
    expect(mocks.closeDatabaseConnection).toHaveBeenCalledTimes(1),
  )
}

describe('remove-rare-categories seed script', () => {
  beforeEach(() => {
    process.exitCode = undefined
  })

  afterEach(() => {
    process.exitCode = undefined
  })

  test('removes rare categories and orphan quotes, then closes the connection', async () => {
    mocks.quoteCategoryFindAll.mockResolvedValue([{ CategoryId: 5 }])
    mocks.quoteFindAll.mockResolvedValue([{ id: 9 }])

    await runScript()

    expect(mocks.categoryDestroy).toHaveBeenCalledWith({ where: { id: [5] } })
    expect(mocks.quoteDestroy).toHaveBeenCalledWith({ where: { id: [9] } })
    expect(process.exitCode).toBeUndefined()
  })

  test('closes the connection and sets exit code 1 on error', async () => {
    mocks.quoteCategoryFindAll.mockRejectedValue(new Error('db down'))

    await runScript()

    expect(mocks.categoryDestroy).not.toHaveBeenCalled()
    expect(process.exitCode).toBe(1)
  })
})
