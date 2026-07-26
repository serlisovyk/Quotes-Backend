import { describe, expect, test, vi } from 'vitest'
import {
  ORDER_BY_ID_ASC,
  PUBLIC_MODEL_ATTRIBUTES,
} from '../../../constants/query-options.constant.js'
import { buildCategoryDetailsQuery, buildCategoryListQuery } from './index.js'

vi.mock('../../../constants/query-options.constant.js', () => ({
  ORDER_BY_ID_ASC: [['id', 'ASC']],
  PUBLIC_MODEL_ATTRIBUTES: { exclude: ['createdAt', 'updatedAt'] },
}))

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
