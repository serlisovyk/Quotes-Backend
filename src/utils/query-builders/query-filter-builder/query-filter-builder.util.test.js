import { describe, expect, test } from 'vitest'
import { Op } from 'sequelize'
import { buildLikeFilters } from './index.js'

describe('QueryFilterBuilder Util', () => {
  test('builds iLike filters for provided values', () => {
    expect(buildLikeFilters({ author: 'mark', text: 'life' })).toEqual({
      author: { [Op.iLike]: '%mark%' },
      text: { [Op.iLike]: '%life%' },
    })
  })

  test('skips empty values', () => {
    expect(buildLikeFilters({ author: '', text: undefined })).toEqual({})
  })
})
