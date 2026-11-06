import { beforeEach, describe, expect, test, vi } from 'vitest'
import { Category } from '#models'
import {
  buildCategoryDetailsQuery,
  buildCategoryListQuery,
} from '#utils/query-builders/category-query-builder'
import {
  findCategories,
  findOrCreateCategories,
  findSingleCategory,
  setQuoteCategories,
} from '#services/categories'

vi.mock('#models', () => ({
  Category: {
    findAndCountAll: vi.fn(),
    findByPk: vi.fn(),
    findOrCreate: vi.fn(),
  },
}))

vi.mock('#utils/query-builders/category-query-builder', () => ({
  buildCategoryDetailsQuery: vi.fn(),
  buildCategoryListQuery: vi.fn(),
}))

describe('Categories Service', () => {
  beforeEach(() => vi.clearAllMocks())

  test('finds categories with query options and pagination', async () => {
    const categories = [{ id: 1, name: 'life' }]
    const listQuery = { attributes: ['id'], where: { name: 'life' } }

    buildCategoryListQuery.mockReturnValue(listQuery)
    Category.findAndCountAll.mockResolvedValue({ count: 7, rows: categories })

    const result = await findCategories({ limit: 5, offset: 10, name: 'life' })

    expect(buildCategoryListQuery).toHaveBeenCalledWith({ name: 'life' })
    expect(Category.findAndCountAll).toHaveBeenCalledWith({
      ...listQuery,
      limit: 5,
      offset: 10,
    })
    expect(result).toEqual({ total: 7, categories })
  })

  test('finds no categories when nothing matches', async () => {
    buildCategoryListQuery.mockReturnValue({})
    Category.findAndCountAll.mockResolvedValue({ count: 0, rows: [] })

    const result = await findCategories({ limit: 5, offset: 0, name: 'none' })

    expect(result).toEqual({ total: 0, categories: [] })
  })

  test('finds single category by id', async () => {
    const category = { id: 1, name: 'life' }
    const detailsQuery = { attributes: ['id', 'name'] }

    buildCategoryDetailsQuery.mockReturnValue(detailsQuery)
    Category.findByPk.mockResolvedValue(category)

    const result = await findSingleCategory(1)

    expect(Category.findByPk).toHaveBeenCalledWith(1, detailsQuery)
    expect(result).toBe(category)
  })

  test('finds or creates categories', async () => {
    const transaction = { id: 'transaction' }
    const life = { id: 1, name: 'life' }
    const work = { id: 2, name: 'work' }

    Category.findOrCreate
      .mockResolvedValueOnce([life, false])
      .mockResolvedValueOnce([work, true])

    const result = await findOrCreateCategories(['life', 'work'], transaction)

    expect(Category.findOrCreate).toHaveBeenNthCalledWith(1, {
      where: { name: 'life' },
      transaction,
    })
    expect(Category.findOrCreate).toHaveBeenNthCalledWith(2, {
      where: { name: 'work' },
      transaction,
    })
    expect(result).toEqual([life, work])
  })

  test('finds or creates categories one after another', async () => {
    const transaction = { id: 'transaction' }
    let runningCalls = 0
    let maxRunningCalls = 0

    Category.findOrCreate.mockImplementation(async ({ where: { name } }) => {
      runningCalls += 1
      maxRunningCalls = Math.max(maxRunningCalls, runningCalls)
      await Promise.resolve()
      runningCalls -= 1

      return [{ name }, false]
    })

    const result = await findOrCreateCategories(['a', 'b', 'c'], transaction)

    expect(maxRunningCalls).toBe(1)
    expect(result).toEqual([{ name: 'a' }, { name: 'b' }, { name: 'c' }])
  })

  test('sets quote categories inside transaction', async () => {
    const transaction = { id: 'transaction' }
    const quote = {
      setCategories: vi.fn(),
    }
    const categories = [{ id: 1, name: 'life' }]

    Category.findOrCreate.mockResolvedValue([categories[0], false])

    await setQuoteCategories(quote, ['life'], transaction)

    expect(quote.setCategories).toHaveBeenCalledWith(categories, {
      transaction,
    })
  })
})
