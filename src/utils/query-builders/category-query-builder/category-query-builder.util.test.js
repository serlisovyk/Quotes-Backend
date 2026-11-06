import { describe, expect, test } from 'vitest'
import { ORDER_BY_ID_ASC, PUBLIC_MODEL_ATTRIBUTES } from '#constants'
import {
  buildCategoryDetailsQuery,
  buildCategoryListQuery,
} from '#utils/query-builders/category-query-builder'

describe('CategoryQueryBuilder Util', () => {
  test('builds category list query without filters', () => {
    expect(buildCategoryListQuery({})).toEqual({
      attributes: PUBLIC_MODEL_ATTRIBUTES,
      order: ORDER_BY_ID_ASC,
      where: {},
    })
  })

  test('builds category list query with name filter', () => {
    expect(buildCategoryListQuery({ name: 'life' })).toMatchObject({
      attributes: PUBLIC_MODEL_ATTRIBUTES,
      order: ORDER_BY_ID_ASC,
    })
    expect(buildCategoryListQuery({ name: 'life' }).where.name).toBeDefined()
  })

  test('builds category details query', () => {
    expect(buildCategoryDetailsQuery()).toEqual({
      attributes: PUBLIC_MODEL_ATTRIBUTES,
    })
  })
})
