import { beforeEach, describe, expect, test, vi } from 'vitest'
import {
  DEFAULT_OFFSET,
  DEFAULT_QUOTES_LIMIT,
  HTTP_STATUS,
  RANDOM_QUOTES_LIMIT,
  ROUTE,
} from '#constants/app.constant'
import { ERROR_MESSAGE } from '#constants/errors.constant'
import NotFoundError from '#error-classes/not-found'
import * as QuotesService from '#services/quotes'
import { createResponseMock } from '#tests/mocks/response'
import {
  deleteQuoteById,
  getQuoteById,
  getQuotes,
  getRandomQuotes,
  patchQuoteById,
  postQuote,
} from '#controllers/quotes'

vi.mock('#services/quotes', () => ({
  createQuote: vi.fn(),
  deleteSingleQuote: vi.fn(),
  findQuotes: vi.fn(),
  findRandomQuotes: vi.fn(),
  findSingleQuote: vi.fn(),
  modifySingleQuote: vi.fn(),
}))

describe('Quotes Controller', () => {
  beforeEach(() => vi.clearAllMocks())

  test('gets quotes with default pagination', async () => {
    const result = { total: 1, quotes: [{ id: 1, text: 'Hello' }] }
    const req = { query: {} }
    const res = createResponseMock()

    QuotesService.findQuotes.mockResolvedValue(result)

    await getQuotes(req, res)

    expect(QuotesService.findQuotes).toHaveBeenCalledWith({
      limit: DEFAULT_QUOTES_LIMIT,
      offset: DEFAULT_OFFSET,
      author: undefined,
      text: undefined,
      category: undefined,
    })
    expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.OK)
    expect(res.json).toHaveBeenCalledWith(result)
  })

  test('gets quotes with provided query filters', async () => {
    const result = { total: 1, quotes: [{ id: 2, text: 'Stay sharp' }] }
    const req = {
      query: {
        author: 'Author',
        category: 'focus',
        limit: 7,
        offset: 14,
        text: 'sharp',
      },
    }
    const res = createResponseMock()

    QuotesService.findQuotes.mockResolvedValue(result)

    await getQuotes(req, res)

    expect(QuotesService.findQuotes).toHaveBeenCalledWith({
      limit: 7,
      offset: 14,
      author: 'Author',
      text: 'sharp',
      category: 'focus',
    })
    expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.OK)
    expect(res.json).toHaveBeenCalledWith(result)
  })

  test('gets random quotes with default limit', async () => {
    const quotes = [{ id: 3, text: 'Random' }]
    const req = { query: {} }
    const res = createResponseMock()

    QuotesService.findRandomQuotes.mockResolvedValue(quotes)

    await getRandomQuotes(req, res)

    expect(QuotesService.findRandomQuotes).toHaveBeenCalledWith(RANDOM_QUOTES_LIMIT)
    expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.OK)
    expect(res.json).toHaveBeenCalledWith(quotes)
  })

  test('gets random quotes with provided limit', async () => {
    const quotes = [{ id: 4, text: 'Random limit' }]
    const req = { query: { limit: 3 } }
    const res = createResponseMock()

    QuotesService.findRandomQuotes.mockResolvedValue(quotes)

    await getRandomQuotes(req, res)

    expect(QuotesService.findRandomQuotes).toHaveBeenCalledWith(3)
    expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.OK)
    expect(res.json).toHaveBeenCalledWith(quotes)
  })

  test('gets a quote by id', async () => {
    const quote = { id: 5, text: 'Details' }
    const req = { params: { id: '5' } }
    const res = createResponseMock()

    QuotesService.findSingleQuote.mockResolvedValue(quote)

    await getQuoteById(req, res)

    expect(QuotesService.findSingleQuote).toHaveBeenCalledWith('5')
    expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.OK)
    expect(res.json).toHaveBeenCalledWith(quote)
  })

  test('throws not found error when quote does not exist', async () => {
    const req = { params: { id: '404' } }
    const res = createResponseMock()

    QuotesService.findSingleQuote.mockResolvedValue(null)

    await expect(getQuoteById(req, res)).rejects.toEqual(
      new NotFoundError(ERROR_MESSAGE.QUOTE_NOT_FOUND('404')),
    )
    expect(res.status).not.toHaveBeenCalled()
    expect(res.json).not.toHaveBeenCalled()
  })

  test('deletes a quote by id', async () => {
    const req = { params: { id: '6' } }
    const res = createResponseMock()

    QuotesService.deleteSingleQuote.mockResolvedValue(true)

    await deleteQuoteById(req, res)

    expect(QuotesService.deleteSingleQuote).toHaveBeenCalledWith('6')
    expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.NO_CONTENT)
    expect(res.send).toHaveBeenCalled()
  })

  test('throws not found error when deleting missing quote', async () => {
    const req = { params: { id: '404' } }
    const res = createResponseMock()

    QuotesService.deleteSingleQuote.mockResolvedValue(false)

    await expect(deleteQuoteById(req, res)).rejects.toEqual(
      new NotFoundError(ERROR_MESSAGE.QUOTE_NOT_FOUND('404')),
    )
    expect(res.status).not.toHaveBeenCalled()
  })

  test('patches a quote by id', async () => {
    const modifiedQuote = { id: 7, text: 'Updated', author: 'New author' }
    const req = {
      body: { author: 'New author', categories: ['life'], text: 'Updated' },
      params: { id: '7' },
    }
    const res = createResponseMock()

    QuotesService.modifySingleQuote.mockResolvedValue(modifiedQuote)

    await patchQuoteById(req, res)

    expect(QuotesService.modifySingleQuote).toHaveBeenCalledWith('7', {
      text: 'Updated',
      author: 'New author',
      categories: ['life'],
    })
    expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.OK)
    expect(res.json).toHaveBeenCalledWith(modifiedQuote)
  })

  test('throws not found error when patching missing quote', async () => {
    const req = {
      body: { text: 'Updated' },
      params: { id: '404' },
    }
    const res = createResponseMock()

    QuotesService.modifySingleQuote.mockResolvedValue(null)

    await expect(patchQuoteById(req, res)).rejects.toEqual(
      new NotFoundError(ERROR_MESSAGE.QUOTE_NOT_FOUND('404')),
    )
    expect(res.status).not.toHaveBeenCalled()
  })

  test('creates a quote and sets location header', async () => {
    const quote = { id: 8, text: 'Created', author: 'Author' }
    const req = {
      body: { author: 'Author', categories: ['work'], text: 'Created' },
    }
    const res = createResponseMock()

    QuotesService.createQuote.mockResolvedValue(quote)

    await postQuote(req, res)

    expect(QuotesService.createQuote).toHaveBeenCalledWith({
      text: 'Created',
      author: 'Author',
      categories: ['work'],
    })
    expect(res.location).toHaveBeenCalledWith(`${ROUTE.QUOTES}/8`)
    expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.CREATED)
    expect(res.json).toHaveBeenCalledWith(quote)
  })
})
