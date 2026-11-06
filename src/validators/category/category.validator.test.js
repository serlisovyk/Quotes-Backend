import { describe, expect, test } from 'vitest'
import { runValidators } from '#tests/utils/run-validators'
import {
  getCategoriesValidators,
  getSingleCategoryValidators,
} from '#validators/category'
import { CATEGORY_NAME_MAX_LENGTH, ERROR_MESSAGE } from '#constants'

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

  test('rejects category search query longer than the maximum', async () => {
    const req = { query: { name: 'a'.repeat(CATEGORY_NAME_MAX_LENGTH + 1) } }
    const result = await runValidators(getCategoriesValidators, req)

    expect(result.array()).toMatchObject([
      { path: 'name', msg: ERROR_MESSAGE.CATEGORY_NAME_TOO_LONG },
    ])
  })

  test('validates single category id param', async () => {
    const req = { params: { id: '15' } }
    const result = await runValidators(getSingleCategoryValidators, req)

    expect(result.isEmpty()).toBe(true)
    expect(req.params.id).toBe(15)
  })
})
