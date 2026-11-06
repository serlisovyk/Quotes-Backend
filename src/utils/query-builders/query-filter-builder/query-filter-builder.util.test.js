import { describe, expect, test } from 'vitest'
import { Op } from 'sequelize'
import {
  buildAnyLikeFilter,
  buildLikeFilters,
} from '#utils/query-builders/query-filter-builder'

describe('QueryFilterBuilder Util', () => {
  test('builds iLike filters for provided values', () => {
    expect(buildLikeFilters({ author: 'mark', text: 'life' })).toEqual({
      author: { [Op.iLike]: '%mark%' },
      text: { [Op.iLike]: '%life%' },
    })
  })

  test('builds iLike filters with escaped wildcard characters', () => {
    expect(buildLikeFilters({ text: '50%_\\' })).toEqual({
      text: { [Op.iLike]: '%50\\%\\_\\\\%' },
    })
  })

  test('skips empty values', () => {
    expect(buildLikeFilters({ author: '', text: undefined })).toEqual({})
  })

  test('builds an OR of iLike conditions over the fields', () => {
    expect(buildAnyLikeFilter(['text', 'author'], 'love')).toEqual({
      [Op.or]: [
        { text: { [Op.iLike]: '%love%' } },
        { author: { [Op.iLike]: '%love%' } },
      ],
    })
  })

  test('escapes wildcard characters in the OR conditions', () => {
    expect(buildAnyLikeFilter(['text'], '5_%')).toEqual({
      [Op.or]: [{ text: { [Op.iLike]: '%5\\_\\%%' } }],
    })
  })

  test('skips the OR filter for an empty value', () => {
    expect(buildAnyLikeFilter(['text', 'author'], '')).toEqual({})
    expect(buildAnyLikeFilter(['text', 'author'], undefined)).toEqual({})
  })
})
