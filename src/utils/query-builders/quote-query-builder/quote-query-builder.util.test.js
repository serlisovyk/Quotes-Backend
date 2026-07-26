import { describe, expect, test, vi } from 'vitest'
import {
  ORDER_BY_ID_ASC,
  PUBLIC_MODEL_ATTRIBUTES,
  QUOTE_CATEGORY_INCLUDE,
} from '#constants/query-options.constant'
import {
  buildQuoteCategoryInclude,
  buildQuoteDetailsQuery,
  buildQuoteListQuery,
  buildQuotesByIdsQuery,
  buildQuoteWhere,
  buildRandomQuotesQuery,
} from '#utils/query-builders/quote-query-builder'

vi.mock('#constants/query-options.constant', () => ({
  ORDER_BY_ID_ASC: [['id', 'ASC']],
  PUBLIC_MODEL_ATTRIBUTES: { exclude: ['createdAt', 'updatedAt'] },
  QUOTE_CATEGORY_INCLUDE: {
    attributes: ['name'],
    model: 'Category',
    through: { attributes: [] },
  },
}))

describe('QuoteQueryBuilder Util', () => {
  test('builds quote where filters', () => {
    const where = buildQuoteWhere({ author: 'seneca', text: 'time' })

    expect(where.author).toBeDefined()
    expect(where.text).toBeDefined()
  })

  test('returns default category include without category filter', () => {
    expect(buildQuoteCategoryInclude()).toEqual(QUOTE_CATEGORY_INCLUDE)
  })

  test('adds category where filter to include', () => {
    expect(buildQuoteCategoryInclude('life')).toEqual({
      ...QUOTE_CATEGORY_INCLUDE,
      where: { name: 'life' },
    })
  })

  test('builds quote list query', () => {
    expect(buildQuoteListQuery({ author: 'a', text: 't', category: 'c' })).toEqual({
      attributes: PUBLIC_MODEL_ATTRIBUTES,
      order: ORDER_BY_ID_ASC,
      where: buildQuoteWhere({ author: 'a', text: 't' }),
      include: buildQuoteCategoryInclude('c'),
    })
  })

  test('builds quotes by ids query', () => {
    expect(buildQuotesByIdsQuery([1, 2])).toEqual({
      attributes: PUBLIC_MODEL_ATTRIBUTES,
      order: ORDER_BY_ID_ASC,
      include: QUOTE_CATEGORY_INCLUDE,
      where: { id: [1, 2] },
    })
  })

  test('builds quote details query', () => {
    expect(buildQuoteDetailsQuery()).toEqual({
      attributes: PUBLIC_MODEL_ATTRIBUTES,
      include: QUOTE_CATEGORY_INCLUDE,
    })
  })

  test('builds random quotes query', () => {
    const randomOrder = Symbol('random')

    expect(buildRandomQuotesQuery(randomOrder, 3)).toEqual({
      attributes: PUBLIC_MODEL_ATTRIBUTES,
      limit: 3,
      order: randomOrder,
      include: QUOTE_CATEGORY_INCLUDE,
    })
  })
})
