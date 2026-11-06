import { beforeEach, describe, expect, test, vi } from 'vitest'
import { createRouterTestClientFactory } from '#tests/utils/router-test-client'
import * as CategoriesController from '#controllers/categories'
import categoriesRouter from '#routes/categories'
import { HTTP_STATUS, ROUTE, ERROR_CODE } from '#constants'

vi.mock('#controllers/categories', () => ({
  getCategories: vi.fn((req, res) =>
    res.status(200).json({ total: 0, categories: [], query: req.query }),
  ),
  getCategoryById: vi.fn((req, res) => res.status(200).json({ id: req.params.id })),
}))

const requestCategoriesRouter = createRouterTestClientFactory({
  route: ROUTE.CATEGORIES,
  router: categoriesRouter,
})

describe('Categories Router', () => {
  beforeEach(() => vi.clearAllMocks())

  test('routes valid categories query to controller', async () => {
    const response = await requestCategoriesRouter().get(
      `${ROUTE.CATEGORIES}?limit=2&offset=1&name=Life`,
    )

    expect(response.status).toBe(HTTP_STATUS.OK)
    expect(response.body).toEqual({
      total: 0,
      categories: [],
      query: {
        limit: '2',
        offset: '1',
        name: 'Life',
      },
    })
    expect(CategoriesController.getCategories).toHaveBeenCalled()
  })

  test('rejects invalid category id before controller', async () => {
    const response = await requestCategoriesRouter().get(`${ROUTE.CATEGORIES}/0`)

    expect(response.status).toBe(HTTP_STATUS.BAD_REQUEST)
    expect(response.body.error.code).toBe(ERROR_CODE.VALIDATION_ERROR)
    expect(CategoriesController.getCategoryById).not.toHaveBeenCalled()
  })
})
