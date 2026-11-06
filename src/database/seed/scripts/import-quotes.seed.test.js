import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'

const mocks = vi.hoisted(() => ({
  allowSeedReset: true,
  rows: [],
  sync: vi.fn(),
  quoteCreate: vi.fn(),
  findOrCreateCategories: vi.fn(),
  closeDatabaseConnection: vi.fn(),
  pauseStream: vi.fn(),
}))

vi.mock('fs', () => ({
  default: {
    createReadStream: () => ({ pipe: () => mocks.rows }),
  },
}))

vi.mock('csv-parser', () => ({ default: () => null }))

vi.mock('#database', () => ({ default: { sync: mocks.sync } }))

vi.mock('#models', () => ({ Quote: { create: mocks.quoteCreate } }))

vi.mock('#logger', () => ({
  default: { info: vi.fn(), warn: vi.fn(), success: vi.fn(), error: vi.fn() },
}))

vi.mock('#services/categories', () => ({
  findOrCreateCategories: mocks.findOrCreateCategories,
}))

vi.mock('#utils/database/close-database-connection', () => ({
  default: mocks.closeDatabaseConnection,
}))

vi.mock('#utils/seed/pause-stream', () => ({ default: mocks.pauseStream }))

vi.mock('#config', () => ({
  get ALLOW_SEED_RESET() {
    return mocks.allowSeedReset
  },
  CSV_IMPORT_BATCH_SIZE: 1000,
  CSV_IMPORT_BATCH_TIMEOUT: 0,
}))

const runScript = async () => {
  vi.resetModules()
  await import('./import-quotes.seed.js')
  await vi.waitFor(() =>
    expect(mocks.closeDatabaseConnection).toHaveBeenCalledTimes(1),
  )
}

describe('import-quotes seed script', () => {
  beforeEach(() => {
    mocks.allowSeedReset = true
    mocks.rows = [
      { quote: 'Text', author: 'Author, Source', category: 'life,work' },
      { quote: 'Skipped', author: 'Author', category: 'bad category' },
    ]
    process.exitCode = undefined
  })

  afterEach(() => {
    process.exitCode = undefined
  })

  test('imports valid rows and closes the connection', async () => {
    const quote = { addCategories: vi.fn() }
    const categories = [{ id: 1 }]

    mocks.quoteCreate.mockResolvedValue(quote)
    mocks.findOrCreateCategories.mockResolvedValue(categories)

    await runScript()

    expect(mocks.sync).toHaveBeenCalledWith({ force: true })
    expect(mocks.quoteCreate).toHaveBeenCalledTimes(1)
    expect(mocks.quoteCreate).toHaveBeenCalledWith({
      text: 'Text',
      author: 'Author',
    })
    expect(mocks.findOrCreateCategories).toHaveBeenCalledWith(['life', 'work'])
    expect(quote.addCategories).toHaveBeenCalledWith(categories)
    expect(process.exitCode).toBeUndefined()
  })

  test('closes the connection and sets exit code 1 on error', async () => {
    mocks.sync.mockRejectedValue(new Error('db down'))

    await runScript()

    expect(mocks.quoteCreate).not.toHaveBeenCalled()
    expect(process.exitCode).toBe(1)
  })

  test('refuses to reset without ALLOW_SEED_RESET but still closes the connection', async () => {
    mocks.allowSeedReset = false

    await runScript()

    expect(mocks.sync).not.toHaveBeenCalled()
    expect(process.exitCode).toBe(1)
  })
})
