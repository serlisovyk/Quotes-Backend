import { describe, expect, test } from 'vitest'
import { runValidators } from '#tests/utils/run-validators'
import { ERROR_MESSAGE, MAX_RANDOM_QUOTES_LIMIT } from '#constants'
import {
  deleteSingleQuoteValidators,
  getQuotesValidators,
  getRandomQuotesValidators,
  getSingleQuoteValidators,
  patchSingleQuoteValidators,
  postQuoteValidators,
} from '#validators/quote'

describe('Quote Validator', () => {
  test('accepts valid quotes query and converts pagination', async () => {
    const req = {
      query: {
        author: '  Seneca ',
        category: 'life',
        limit: '5',
        offset: '10',
        text: ' time ',
      },
    }

    const result = await runValidators(getQuotesValidators, req)

    expect(result.isEmpty()).toBe(true)
    expect(req.query.limit).toBe(5)
    expect(req.query.offset).toBe(10)
    expect(req.query.author).toBe('Seneca')
    expect(req.query.text).toBe('time')
  })

  test('rejects invalid quote category query', async () => {
    const req = { query: { category: 'Life' } }
    const result = await runValidators(getQuotesValidators, req)

    expect(result.array()).toMatchObject([
      {
        path: 'category',
        msg: ERROR_MESSAGE.INVALID_CATEGORY_NAME,
      },
    ])
  })

  test('accepts random quotes limit and converts it', async () => {
    const req = { query: { limit: '3' } }
    const result = await runValidators(getRandomQuotesValidators, req)

    expect(result.isEmpty()).toBe(true)
    expect(req.query.limit).toBe(3)
  })

  test('rejects random quotes limit outside allowed range', async () => {
    const req = { query: { limit: String(MAX_RANDOM_QUOTES_LIMIT + 1) } }
    const result = await runValidators(getRandomQuotesValidators, req)

    expect(result.array()).toMatchObject([{ path: 'limit' }])
  })

  test('accepts valid quote create body', async () => {
    const req = {
      body: {
        author: ' Seneca ',
        categories: ['life', 'work'],
        text: ' A valid quote text ',
      },
    }

    const result = await runValidators(postQuoteValidators, req)

    expect(result.isEmpty()).toBe(true)
    expect(req.body.author).toBe('Seneca')
    expect(req.body.text).toBe('A valid quote text')
  })

  test('rejects invalid quote create body', async () => {
    const req = {
      body: {
        author: 'A',
        categories: [],
        text: 'short',
      },
    }

    const result = await runValidators(postQuoteValidators, req)
    const errors = result.array()

    expect(errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ path: 'text' }),
        expect.objectContaining({ path: 'author' }),
        expect.objectContaining({ path: 'categories' }),
      ]),
    )
  })

  test('validates quote id params', async () => {
    const getReq = { params: { id: '1' } }
    const deleteReq = { params: { id: '2' } }

    await expect(
      runValidators(getSingleQuoteValidators, getReq),
    ).resolves.toMatchObject({ errors: [] })
    await expect(
      runValidators(deleteSingleQuoteValidators, deleteReq),
    ).resolves.toMatchObject({ errors: [] })

    expect(getReq.params.id).toBe(1)
    expect(deleteReq.params.id).toBe(2)
  })

  test('accepts patch with only id param', async () => {
    const req = {
      body: {},
      params: { id: '3' },
    }

    const result = await runValidators(patchSingleQuoteValidators, req)

    expect(result.isEmpty()).toBe(true)
    expect(req.params.id).toBe(3)
  })

  test('rejects invalid patch category item', async () => {
    const req = {
      body: {
        categories: ['Life'],
      },
      params: { id: '3' },
    }

    const result = await runValidators(patchSingleQuoteValidators, req)

    expect(result.array()).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          path: 'categories[0]',
          msg: ERROR_MESSAGE.INVALID_CATEGORY_NAME,
        }),
      ]),
    )
  })
})
