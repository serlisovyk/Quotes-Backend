import { describe, expect, test } from 'vitest'
import { query } from 'express-validator'
import { runValidators } from '#tests/utils/run-validators'
import { ERROR_MESSAGE, MAX_LIST_LIMIT } from '#constants'
import {
  categoryNameValidator,
  categorySearchValidator,
  idParamValidator,
  listLimitQueryValidator,
  offsetQueryValidator,
} from '#validators/shared'

describe('Shared Validator', () => {
  test('validates and converts list limit query', async () => {
    const req = { query: { limit: '5' } }
    const result = await runValidators([listLimitQueryValidator()], req)

    expect(result.isEmpty()).toBe(true)
    expect(req.query.limit).toBe(5)
  })

  test('rejects list limit outside allowed range', async () => {
    const req = { query: { limit: String(MAX_LIST_LIMIT + 1) } }
    const result = await runValidators([listLimitQueryValidator()], req)

    expect(result.array()).toMatchObject([
      {
        path: 'limit',
        msg: ERROR_MESSAGE.INVALID_LIST_LIMIT,
      },
    ])
  })

  test('validates and converts offset query', async () => {
    const req = { query: { offset: '10' } }
    const result = await runValidators([offsetQueryValidator()], req)

    expect(result.isEmpty()).toBe(true)
    expect(req.query.offset).toBe(10)
  })

  test('rejects negative offset query', async () => {
    const req = { query: { offset: '-5' } }
    const result = await runValidators([offsetQueryValidator()], req)

    expect(result.array()).toMatchObject([
      {
        path: 'offset',
        msg: ERROR_MESSAGE.INVALID_OFFSET,
      },
    ])
  })

  test('validates and converts id param', async () => {
    const req = { params: { id: '42' } }
    const result = await runValidators([idParamValidator()], req)

    expect(result.isEmpty()).toBe(true)
    expect(req.params.id).toBe(42)
  })

  test('rejects invalid id param', async () => {
    const req = { params: { id: '0' } }
    const result = await runValidators([idParamValidator()], req)

    expect(result.array()).toMatchObject([
      {
        path: 'id',
        msg: ERROR_MESSAGE.INVALID_ENTITY_ID,
      },
    ])
  })

  test('validates category name', async () => {
    const req = { query: { category: 'self-development' } }
    const result = await runValidators(
      [categoryNameValidator(query('category'))],
      req,
    )

    expect(result.isEmpty()).toBe(true)
  })

  test('rejects invalid category name', async () => {
    const req = { query: { category: 'Self Development' } }
    const result = await runValidators(
      [categoryNameValidator(query('category'))],
      req,
    )

    expect(result.array()).toMatchObject([
      {
        path: 'category',
        msg: ERROR_MESSAGE.INVALID_CATEGORY_NAME,
      },
    ])
  })

  test('allows case-insensitive category search', async () => {
    const req = { query: { name: 'Life' } }
    const result = await runValidators([categorySearchValidator(query('name'))], req)

    expect(result.isEmpty()).toBe(true)
  })

  test('rejects invalid category search', async () => {
    const req = { query: { name: 'bad value' } }
    const result = await runValidators([categorySearchValidator(query('name'))], req)

    expect(result.array()).toMatchObject([
      {
        path: 'name',
        msg: ERROR_MESSAGE.INVALID_CATEGORY_SEARCH,
      },
    ])
  })
})
