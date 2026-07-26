import { beforeEach, describe, expect, test, vi } from 'vitest'
import sequelize from '../../database/db.js'
import Quote from '../../database/models/quote.model.js'
import { setQuoteCategories } from '../categories/index.js'
import {
  buildQuoteDetailsQuery,
  buildQuoteListQuery,
  buildQuotesByIdsQuery,
  buildRandomQuotesQuery,
} from '../../utils/query-builders/quote-query-builder/index.js'
import {
  createQuote,
  deleteSingleQuote,
  findQuotes,
  findRandomQuotes,
  findSingleQuote,
  modifySingleQuote,
} from './index.js'

vi.mock('../../database/db.js', () => ({
  default: {
    random: vi.fn(),
    transaction: vi.fn(),
  },
}))

vi.mock('../../database/models/quote.model.js', () => ({
  default: {
    create: vi.fn(),
    destroy: vi.fn(),
    findAll: vi.fn(),
    findAndCountAll: vi.fn(),
    findByPk: vi.fn(),
  },
}))

vi.mock('../categories/index.js', () => ({
  setQuoteCategories: vi.fn(),
}))

vi.mock('../../utils/query-builders/quote-query-builder/index.js', () => ({
  buildQuoteDetailsQuery: vi.fn(),
  buildQuoteListQuery: vi.fn(),
  buildQuotesByIdsQuery: vi.fn(),
  buildRandomQuotesQuery: vi.fn(),
}))

const transaction = { id: 'transaction' }

describe('Quotes Service', () => {
  beforeEach(() => {
    vi.clearAllMocks()

    sequelize.transaction.mockImplementation((callback) => callback(transaction))
  })

  test('finds quotes without category filter', async () => {
    const listQuery = { include: [], where: { author: 'a' } }
    const pageQuotes = [{ id: 1 }]

    buildQuoteListQuery.mockReturnValue(listQuery)
    Quote.findAndCountAll.mockResolvedValue({ count: 1, rows: pageQuotes })

    const result = await findQuotes({
      author: 'a',
      category: undefined,
      limit: 5,
      offset: 10,
      text: undefined,
    })

    expect(Quote.findAndCountAll).toHaveBeenCalledWith({
      ...listQuery,
      distinct: true,
      limit: 5,
      offset: 10,
    })
    expect(Quote.findAll).not.toHaveBeenCalled()
    expect(result).toEqual({ total: 1, quotes: pageQuotes })
  })

  test('finds full quotes by ids when category filter is used', async () => {
    const listQuery = { include: [{ where: { name: 'life' } }], where: {} }
    const pageQuotes = [{ id: 1 }, { id: 2 }]
    const quotes = [{ id: 1, categories: [] }]
    const byIdsQuery = { where: { id: [1, 2] } }

    buildQuoteListQuery.mockReturnValue(listQuery)
    buildQuotesByIdsQuery.mockReturnValue(byIdsQuery)
    Quote.findAndCountAll.mockResolvedValue({ count: 2, rows: pageQuotes })
    Quote.findAll.mockResolvedValue(quotes)

    const result = await findQuotes({
      author: undefined,
      category: 'life',
      limit: 5,
      offset: 0,
      text: undefined,
    })

    expect(buildQuoteListQuery).toHaveBeenCalledWith({
      author: undefined,
      text: undefined,
      category: 'life',
    })
    expect(buildQuotesByIdsQuery).toHaveBeenCalledWith([1, 2])
    expect(Quote.findAll).toHaveBeenCalledWith(byIdsQuery)
    expect(result).toEqual({ total: 2, quotes })
  })

  test('finds random quotes', async () => {
    const randomOrder = Symbol('random')
    const randomQuery = { limit: 3, order: randomOrder }
    const quotes = [{ id: 1 }]

    sequelize.random.mockReturnValue(randomOrder)
    buildRandomQuotesQuery.mockReturnValue(randomQuery)
    Quote.findAll.mockResolvedValue(quotes)

    const result = await findRandomQuotes(3)

    expect(buildRandomQuotesQuery).toHaveBeenCalledWith(randomOrder, 3)
    expect(Quote.findAll).toHaveBeenCalledWith(randomQuery)
    expect(result).toBe(quotes)
  })

  test('finds single quote by id', async () => {
    const quote = { id: 1 }
    const detailsQuery = { include: [] }

    buildQuoteDetailsQuery.mockReturnValue(detailsQuery)
    Quote.findByPk.mockResolvedValue(quote)

    const result = await findSingleQuote(1)

    expect(Quote.findByPk).toHaveBeenCalledWith(1, detailsQuery)
    expect(result).toBe(quote)
  })

  test('creates quote inside transaction and returns details', async () => {
    const createdQuote = { id: 10 }
    const detailedQuote = { id: 10, text: 'Created' }
    const detailsQuery = { include: [] }

    Quote.create.mockResolvedValue(createdQuote)
    buildQuoteDetailsQuery.mockReturnValue(detailsQuery)
    Quote.findByPk.mockResolvedValue(detailedQuote)

    const result = await createQuote({
      author: 'Author',
      categories: ['life'],
      text: 'Created',
    })

    expect(Quote.create).toHaveBeenCalledWith(
      { text: 'Created', author: 'Author' },
      { transaction },
    )
    expect(setQuoteCategories).toHaveBeenCalledWith(
      createdQuote,
      ['life'],
      transaction,
    )
    expect(Quote.findByPk).toHaveBeenCalledWith(10, detailsQuery)
    expect(result).toBe(detailedQuote)
  })

  test('returns null when quote to modify does not exist', async () => {
    Quote.findByPk.mockResolvedValue(null)

    const result = await modifySingleQuote(404, { text: 'Missing' })

    expect(result).toBeNull()
    expect(Quote.findByPk).toHaveBeenCalledTimes(1)
  })

  test('modifies quote inside transaction and returns details', async () => {
    const quote = {
      id: 11,
      author: 'Old author',
      save: vi.fn(),
      text: 'Old text',
    }
    const detailedQuote = { id: 11, text: 'New text', author: 'New author' }
    const detailsQuery = { include: [] }

    Quote.findByPk.mockResolvedValueOnce(quote).mockResolvedValueOnce(detailedQuote)
    buildQuoteDetailsQuery.mockReturnValue(detailsQuery)

    const result = await modifySingleQuote(11, {
      author: 'New author',
      categories: ['work'],
      text: 'New text',
    })

    expect(quote.text).toBe('New text')
    expect(quote.author).toBe('New author')
    expect(quote.save).toHaveBeenCalledWith({ transaction })
    expect(setQuoteCategories).toHaveBeenCalledWith(quote, ['work'], transaction)
    expect(Quote.findByPk).toHaveBeenLastCalledWith(11, detailsQuery)
    expect(result).toBe(detailedQuote)
  })

  test('deletes quote and returns deletion result', async () => {
    Quote.destroy.mockResolvedValueOnce(1).mockResolvedValueOnce(0)

    await expect(deleteSingleQuote(1)).resolves.toBe(true)
    await expect(deleteSingleQuote(2)).resolves.toBe(false)

    expect(Quote.destroy).toHaveBeenNthCalledWith(1, { where: { id: 1 } })
    expect(Quote.destroy).toHaveBeenNthCalledWith(2, { where: { id: 2 } })
  })
})
