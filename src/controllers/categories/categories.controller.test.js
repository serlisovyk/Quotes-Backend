import { beforeEach, describe, expect, test, vi } from 'vitest'
import { createResponseMock } from '#tests/mocks/response'
import NotFoundError from '#error-classes/not-found'
import * as CategoriesService from '#services/categories'
import {
  DEFAULT_CATEGORIES_LIMIT,
  DEFAULT_OFFSET,
  HTTP_STATUS,
} from '#constants/app.constant'
import { ERROR_MESSAGE } from '#constants/errors.constant'
import { getCategories, getCategoryById } from '#controllers/categories'

vi.mock('#services/categories', () => ({
  findCategories: vi.fn(),
  findSingleCategory: vi.fn(),
}))

describe('Categories Controller', () => {
  beforeEach(() => vi.clearAllMocks())

  test('gets categories with default pagination', async () => {
    const categories = [{ id: 1, name: 'life' }]
    const req = { query: {} }
    const res = createResponseMock()

    CategoriesService.findCategories.mockResolvedValue(categories)

    await getCategories(req, res)

    expect(CategoriesService.findCategories).toHaveBeenCalledWith({
      limit: DEFAULT_CATEGORIES_LIMIT,
      offset: DEFAULT_OFFSET,
      name: undefined,
    })
    expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.OK)
    expect(res.json).toHaveBeenCalledWith(categories)
  })

  test('gets categories with provided query filters', async () => {
    const categories = [{ id: 2, name: 'work' }]
    const req = { query: { limit: 5, offset: 10, name: 'wo' } }
    const res = createResponseMock()

    CategoriesService.findCategories.mockResolvedValue(categories)

    await getCategories(req, res)

    expect(CategoriesService.findCategories).toHaveBeenCalledWith({
      limit: 5,
      offset: 10,
      name: 'wo',
    })
    expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.OK)
    expect(res.json).toHaveBeenCalledWith(categories)
  })

  test('gets a category by id', async () => {
    const category = { id: 3, name: 'focus' }
    const req = { params: { id: '3' } }
    const res = createResponseMock()

    CategoriesService.findSingleCategory.mockResolvedValue(category)

    await getCategoryById(req, res)

    expect(CategoriesService.findSingleCategory).toHaveBeenCalledWith('3')
    expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.OK)
    expect(res.json).toHaveBeenCalledWith(category)
  })

  test('throws not found error when category does not exist', async () => {
    const req = { params: { id: '404' } }
    const res = createResponseMock()

    CategoriesService.findSingleCategory.mockResolvedValue(null)

    await expect(getCategoryById(req, res)).rejects.toEqual(
      new NotFoundError(ERROR_MESSAGE.CATEGORY_NOT_FOUND('404')),
    )
    expect(res.status).not.toHaveBeenCalled()
    expect(res.json).not.toHaveBeenCalled()
  })
})
