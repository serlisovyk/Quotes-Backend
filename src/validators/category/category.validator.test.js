import { describe, expect, test } from 'vitest'
import { runValidators } from '#tests/utils/run-validators'
import { ERROR_MESSAGE } from '#constants'
import {
  getCategoriesValidators,
  getSingleCategoryValidators,
} from '#validators/category'

describe('Category Validator', () => {
  test('accepts valid categories query', async () => {
    const req = {
      query: {
        limit: '10',
        name: 'Life',
        offset: '5',
      },
    }

    const result = await runValidators(getCategoriesValidators, req)

    expect(result.isEmpty()).toBe(true)
    expect(req.query.limit).toBe(10)
    expect(req.query.offset).toBe(5)
  })

  test('rejects invalid category search query', async () => {
    const req = {
      query: {
        name: 'bad category',
      },
    }

    const result = await runValidators(getCategoriesValidators, req)

    expect(result.array()).toMatchObject([
      {
        path: 'name',
        msg: ERROR_MESSAGE.INVALID_CATEGORY_SEARCH,
      },
    ])
  })

  test('validates single category id param', async () => {
    const req = { params: { id: '15' } }
    const result = await runValidators(getSingleCategoryValidators, req)

    expect(result.isEmpty()).toBe(true)
    expect(req.params.id).toBe(15)
  })
})
