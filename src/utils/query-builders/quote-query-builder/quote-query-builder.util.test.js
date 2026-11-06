import { describe, expect, test, vi } from 'vitest'
import { Op } from 'sequelize'
import {
  QUOTE_CATEGORY_INCLUDE,
  buildQuoteCategoryInclude,
  buildQuoteDetailsQuery,
  buildQuoteListQuery,
  buildQuoteOrder,
  buildQuotesByIdsQuery,
  buildQuoteWhere,
  buildRandomQuotesQuery,
} from '#utils/query-builders/quote-query-builder'
import {
  ORDER_BY_ID_ASC,
  PUBLIC_MODEL_ATTRIBUTES,
  QUOTE_SORT_FIELDS,
} from '#constants'

vi.mock('#models', () => ({ Category: 'Category' }))

describe('QuoteQueryBuilder Util', () => {
  test('builds quote where filters', () => {
    const where = buildQuoteWhere({ author: 'seneca', text: 'time' })

    expect(where.author).toBeDefined()
    expect(where.text).toBeDefined()
  })

  test('adds an OR search over text and author to the where', () => {
    const where = buildQuoteWhere({ author: 'seneca', search: 'love' })

    expect(where.author).toBeDefined()
    expect(where[Op.or]).toHaveLength(2)
  })

  test('builds quote where without search', () => {
    expect(buildQuoteWhere({})).toEqual({})
  })

  test('orders by id ascending by default', () => {
    expect(buildQuoteOrder()).toEqual([['id', 'ASC']])
    expect(buildQuoteOrder({})).toEqual(ORDER_BY_ID_ASC)
  })

  test('orders by id in the requested direction without tiebreaker', () => {
    expect(buildQuoteOrder({ sort: 'id', order: 'desc' })).toEqual([['id', 'DESC']])
  })

  test('orders by another field with id ascending as tiebreaker', () => {
    expect(buildQuoteOrder({ sort: 'author', order: 'desc' })).toEqual([
      ['author', 'DESC'],
      ['id', 'ASC'],
    ])
    expect(buildQuoteOrder({ sort: 'createdAt' })).toEqual([
      ['createdAt', 'ASC'],
      ['id', 'ASC'],
    ])
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
      attributes: QUOTE_SORT_FIELDS,
      order: ORDER_BY_ID_ASC,
      where: buildQuoteWhere({ author: 'a', text: 't' }),
      include: buildQuoteCategoryInclude('c'),
    })
  })

  test('builds quote list query with search and sort', () => {
    const query = buildQuoteListQuery({
      search: 'love',
      sort: 'author',
      order: 'desc',
    })

    expect(query.order).toEqual(buildQuoteOrder({ sort: 'author', order: 'desc' }))
    expect(query.where).toEqual(buildQuoteWhere({ search: 'love' }))
  })

  test('builds quotes by ids query keeping the requested order', () => {
    expect(
      buildQuotesByIdsQuery([3, 1], { sort: 'createdAt', order: 'desc' }).order,
    ).toEqual([
      ['createdAt', 'DESC'],
      ['id', 'ASC'],
    ])
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
