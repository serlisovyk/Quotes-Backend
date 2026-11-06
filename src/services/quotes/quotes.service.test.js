import { beforeEach, describe, expect, test, vi } from 'vitest'
import sequelize from '#database'
import { Quote } from '#models'
import { ConflictError } from '#errors/classes'
import { ERROR_MESSAGE } from '#constants'
import {
  buildDuplicateQuoteQuery,
  buildQuoteDetailsQuery,
  buildQuoteListQuery,
  buildQuotesByIdsQuery,
  buildRandomQuotesQuery,
} from '#utils/query-builders/quote-query-builder'
import { setQuoteCategories } from '#services/categories'
import {
  createQuote,
  deleteSingleQuote,
  findQuotes,
  findRandomQuotes,
  findSingleQuote,
  modifySingleQuote,
} from '#services/quotes'

vi.mock('#database', () => ({
  default: {
    random: vi.fn(),
    transaction: vi.fn(),
  },
}))

vi.mock('#models', () => ({
  Quote: {
    create: vi.fn(),
    destroy: vi.fn(),
    findAll: vi.fn(),
    findAndCountAll: vi.fn(),
    findByPk: vi.fn(),
    findOne: vi.fn(),
  },
}))

vi.mock('#services/categories', () => ({
  setQuoteCategories: vi.fn(),
}))

vi.mock('#utils/query-builders/quote-query-builder', () => ({
  buildDuplicateQuoteQuery: vi.fn(),
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

  test('finds the page and then full quotes by its ids without category filter', async () => {
    const listQuery = { include: [], where: { author: 'a' } }
    const pageQuotes = [{ id: 1 }]
    const quotes = [{ id: 1, categories: [] }]
    const byIdsQuery = { where: { id: [1] } }

    buildQuoteListQuery.mockReturnValue(listQuery)
    buildQuotesByIdsQuery.mockReturnValue(byIdsQuery)
    Quote.findAndCountAll.mockResolvedValue({ count: 1, rows: pageQuotes })
    Quote.findAll.mockResolvedValue(quotes)

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
    expect(buildQuotesByIdsQuery).toHaveBeenCalledWith([1], {
      sort: undefined,
      order: undefined,
    })
    expect(Quote.findAll).toHaveBeenCalledWith(byIdsQuery)
    expect(result).toEqual({ total: 1, quotes })
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
      order: 'desc',
      search: 'love',
      sort: 'createdAt',
      text: undefined,
    })

    expect(buildQuoteListQuery).toHaveBeenCalledWith({
      author: undefined,
      text: undefined,
      search: 'love',
      category: 'life',
      sort: 'createdAt',
      order: 'desc',
    })
    expect(buildQuotesByIdsQuery).toHaveBeenCalledWith([1, 2], {
      sort: 'createdAt',
      order: 'desc',
    })
    expect(Quote.findAll).toHaveBeenCalledWith(byIdsQuery)
    expect(result).toEqual({ total: 2, quotes })
  })

  test('passes search, sort and order to the list query without category filter', async () => {
    const listQuery = { include: [], where: {} }

    buildQuoteListQuery.mockReturnValue(listQuery)
    Quote.findAndCountAll.mockResolvedValue({ count: 0, rows: [] })

    await findQuotes({
      limit: 5,
      offset: 0,
      order: 'desc',
      search: 'love',
      sort: 'author',
    })

    expect(buildQuoteListQuery).toHaveBeenCalledWith({
      author: undefined,
      text: undefined,
      search: 'love',
      category: undefined,
      sort: 'author',
      order: 'desc',
    })
    expect(buildQuotesByIdsQuery).toHaveBeenCalledWith([], {
      sort: 'author',
      order: 'desc',
    })
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

  test('checks for a duplicate before creating a quote', async () => {
    const duplicateQuery = { where: 'duplicate' }

    buildDuplicateQuoteQuery.mockReturnValue(duplicateQuery)
    Quote.create.mockResolvedValue({ id: 10 })

    await createQuote({ author: 'Author', categories: ['life'], text: 'Created' })

    expect(buildDuplicateQuoteQuery).toHaveBeenCalledWith({
      text: 'Created',
      author: 'Author',
      excludeId: undefined,
    })
    expect(Quote.findOne).toHaveBeenCalledWith({ ...duplicateQuery, transaction })
    expect(Quote.findOne.mock.invocationCallOrder[0]).toBeLessThan(
      Quote.create.mock.invocationCallOrder[0],
    )
  })

  test('throws a conflict and creates nothing when the quote exists', async () => {
    Quote.findOne.mockResolvedValueOnce({ id: 3 })

    await expect(
      createQuote({ author: 'Author', categories: ['life'], text: 'Created' }),
    ).rejects.toEqual(new ConflictError(ERROR_MESSAGE.QUOTE_ALREADY_EXISTS))

    expect(Quote.create).not.toHaveBeenCalled()
    expect(setQuoteCategories).not.toHaveBeenCalled()
  })

  test('checks the resulting text and author of a partial patch, excluding the quote itself', async () => {
    const quote = { id: 11, author: 'Old author', save: vi.fn(), text: 'Old text' }

    Quote.findByPk.mockResolvedValueOnce(quote).mockResolvedValueOnce({ id: 11 })

    await modifySingleQuote(11, { text: 'New text' })

    expect(buildDuplicateQuoteQuery).toHaveBeenCalledWith({
      text: 'New text',
      author: 'Old author',
      excludeId: 11,
    })
  })

  test('throws a conflict and changes nothing when another quote has the result', async () => {
    const quote = { id: 11, author: 'Old author', save: vi.fn(), text: 'Old text' }

    Quote.findByPk.mockResolvedValueOnce(quote)
    Quote.findOne.mockResolvedValueOnce({ id: 4 })

    await expect(
      modifySingleQuote(11, { author: 'Other', categories: ['work'] }),
    ).rejects.toEqual(new ConflictError(ERROR_MESSAGE.QUOTE_ALREADY_EXISTS))

    expect(quote.save).not.toHaveBeenCalled()
    expect(setQuoteCategories).not.toHaveBeenCalled()
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
