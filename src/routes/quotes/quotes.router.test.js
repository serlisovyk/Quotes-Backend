import { beforeEach, describe, expect, test, vi } from 'vitest'
import { HTTP_STATUS, ROUTE } from '../../constants/app.constant.js'
import { ERROR_CODE } from '../../constants/errors.constant.js'
import * as QuotesController from '../../controllers/quotes/index.js'
import { createRouterTestClientFactory } from '../../tests/utils/router-test-client/index.js'
import quotesRouter from './index.js'

vi.mock('../../controllers/quotes/index.js', () => ({
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
})
