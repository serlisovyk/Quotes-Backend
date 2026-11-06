import { beforeEach, describe, expect, test, vi } from 'vitest'
import { createRouterTestClientFactory } from '#tests/utils/router-test-client'
import * as QuotesController from '#controllers/quotes'
import { ConflictError } from '#errors/classes'
import quotesRouter from '#routes/quotes'
import {
  ERROR_CODE,
  ERROR_MESSAGE,
  HTTP_STATUS,
  QUOTE_SEARCH_MAX_LENGTH,
  ROUTE,
} from '#constants'

vi.mock('#controllers/quotes', () => ({
  deleteQuoteById: vi.fn((_, res) => res.status(204).send()),
  getQuoteById: vi.fn((req, res) => res.status(200).json({ id: req.params.id })),
  getQuotes: vi.fn((req, res) => res.status(200).json({ query: req.query })),
  getRandomQuotes: vi.fn((req, res) =>
    res.status(200).json({ limit: req.query.limit }),
  ),
  patchQuoteById: vi.fn((req, res) =>
    res.status(200).json({ body: req.body, id: req.params.id }),
  ),
  postQuote: vi.fn((req, res) => res.status(201).json(req.body)),
}))

const requestQuotesRouter = createRouterTestClientFactory({
  route: ROUTE.QUOTES,
  router: quotesRouter,
})

describe('Quotes Router', () => {
  beforeEach(() => vi.clearAllMocks())

  test('routes random quotes before id route', async () => {
    const response = await requestQuotesRouter().get(
      `${ROUTE.QUOTES}/random?limit=3`,
    )

    expect(response.status).toBe(HTTP_STATUS.OK)
    expect(response.body).toEqual({ limit: '3' })
    expect(QuotesController.getRandomQuotes).toHaveBeenCalled()
    expect(QuotesController.getQuoteById).not.toHaveBeenCalled()
  })

  test('rejects invalid random quotes limit before controller', async () => {
    const response = await requestQuotesRouter().get(
      `${ROUTE.QUOTES}/random?limit=99`,
    )

    expect(response.status).toBe(HTTP_STATUS.BAD_REQUEST)
    expect(response.body.error.code).toBe(ERROR_CODE.VALIDATION_ERROR)
    expect(QuotesController.getRandomQuotes).not.toHaveBeenCalled()
  })

  test('answers a conflict from the create controller as 409 CONFLICT', async () => {
    const body = {
      author: 'Seneca',
      categories: ['life'],
      text: 'A valid quote text',
    }

    QuotesController.postQuote.mockRejectedValueOnce(
      new ConflictError(ERROR_MESSAGE.QUOTE_ALREADY_EXISTS),
    )

    const response = await requestQuotesRouter().post(ROUTE.QUOTES).send(body)

    expect(response.status).toBe(HTTP_STATUS.CONFLICT)
    expect(response.body).toEqual({
      error: {
        code: ERROR_CODE.CONFLICT,
        message: ERROR_MESSAGE.QUOTE_ALREADY_EXISTS,
      },
    })
  })

  test('routes valid create quote body to controller', async () => {
    const body = {
      author: 'Seneca',
      categories: ['life'],
      text: 'A valid quote text',
    }

    const response = await requestQuotesRouter().post(ROUTE.QUOTES).send(body)

    expect(response.status).toBe(HTTP_STATUS.CREATED)
    expect(response.body).toEqual(body)
    expect(QuotesController.postQuote).toHaveBeenCalled()
  })

  test('rejects invalid create quote body before controller', async () => {
    const response = await requestQuotesRouter()
      .post(ROUTE.QUOTES)
      .send({
        author: 'S',
        categories: ['Life'],
        text: 'short',
      })

    expect(response.status).toBe(HTTP_STATUS.BAD_REQUEST)
    expect(response.body.error.code).toBe(ERROR_CODE.VALIDATION_ERROR)
    expect(QuotesController.postQuote).not.toHaveBeenCalled()
  })

  test('routes quotes list with sort, order and search to controller', async () => {
    const response = await requestQuotesRouter().get(
      `${ROUTE.QUOTES}?sort=author&order=desc&search=love`,
    )

    expect(response.status).toBe(HTTP_STATUS.OK)
    expect(response.body.query).toEqual({
      sort: 'author',
      order: 'desc',
      search: 'love',
    })
    expect(QuotesController.getQuotes).toHaveBeenCalled()
  })

  test.each([
    'sort=foo',
    'order=up',
    `search=${'a'.repeat(QUOTE_SEARCH_MAX_LENGTH + 1)}`,
  ])(
    'rejects invalid quotes list query %s before controller',
    async (queryString) => {
      const response = await requestQuotesRouter().get(
        `${ROUTE.QUOTES}?${queryString}`,
      )

      expect(response.status).toBe(HTTP_STATUS.BAD_REQUEST)
      expect(response.body.error.code).toBe(ERROR_CODE.VALIDATION_ERROR)
      expect(QuotesController.getQuotes).not.toHaveBeenCalled()
    },
  )
})
