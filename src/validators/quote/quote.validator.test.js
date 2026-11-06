import { describe, expect, test } from 'vitest'
import { runValidators } from '#tests/utils/run-validators'
import {
  deleteSingleQuoteValidators,
  getQuotesValidators,
  getRandomQuotesValidators,
  getSingleQuoteValidators,
  patchSingleQuoteValidators,
  postQuoteValidators,
} from '#validators/quote'
import {
  CATEGORY_NAME_MAX_LENGTH,
  ERROR_MESSAGE,
  MAX_CATEGORIES_PER_QUOTE,
  MAX_RANDOM_QUOTES_LIMIT,
  QUOTE_AUTHOR_MAX_LENGTH,
  QUOTE_TEXT_MAX_LENGTH,
} from '#constants'

const validCreateBody = {
  author: 'Seneca',
  categories: ['life'],
  text: 'A valid quote text',
}

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

  test('rejects quotes offset with a message', async () => {
    const req = { query: { offset: '-1' } }
    const result = await runValidators(getQuotesValidators, req)

    expect(result.array()).toMatchObject([
      { path: 'offset', msg: ERROR_MESSAGE.INVALID_OFFSET },
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

    expect(result.array()).toMatchObject([
      { path: 'limit', msg: ERROR_MESSAGE.INVALID_RANDOM_LIMIT },
    ])
  })

  test('rejects random quotes limit that is not a number', async () => {
    const req = { query: { limit: 'many' } }
    const result = await runValidators(getRandomQuotesValidators, req)

    expect(result.array()).toMatchObject([
      { path: 'limit', msg: ERROR_MESSAGE.INVALID_RANDOM_LIMIT },
    ])
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

    expect(result.array()).toMatchObject([
      { path: 'text', msg: ERROR_MESSAGE.INVALID_QUOTE_TEXT },
      { path: 'author', msg: ERROR_MESSAGE.INVALID_QUOTE_AUTHOR },
      { path: 'categories', msg: ERROR_MESSAGE.INVALID_QUOTE_CATEGORIES },
    ])
  })

  test('rejects a create body with no fields', async () => {
    const req = { body: {} }
    const result = await runValidators(postQuoteValidators, req)

    expect(result.array()).toMatchObject([
      { path: 'text', msg: ERROR_MESSAGE.INVALID_QUOTE_TEXT },
      { path: 'author', msg: ERROR_MESSAGE.INVALID_QUOTE_AUTHOR },
      { path: 'categories', msg: ERROR_MESSAGE.INVALID_QUOTE_CATEGORIES },
    ])
  })

  test('rejects numeric text instead of turning it into a string', async () => {
    const req = { body: { ...validCreateBody, text: 12345678901 } }
    const result = await runValidators(postQuoteValidators, req)

    expect(result.array()).toMatchObject([
      { path: 'text', msg: ERROR_MESSAGE.INVALID_QUOTE_TEXT },
    ])
  })

  test('rejects numeric author instead of turning it into a string', async () => {
    const req = { body: { ...validCreateBody, author: 12345 } }
    const result = await runValidators(postQuoteValidators, req)

    expect(result.array()).toMatchObject([
      { path: 'author', msg: ERROR_MESSAGE.INVALID_QUOTE_AUTHOR },
    ])
  })

  test('rejects text that is too short after trimming', async () => {
    const req = { body: { ...validCreateBody, text: '   short    ' } }
    const result = await runValidators(postQuoteValidators, req)

    expect(result.array()).toMatchObject([
      { path: 'text', msg: ERROR_MESSAGE.INVALID_QUOTE_TEXT },
    ])
  })

  test('rejects author longer than the maximum length', async () => {
    const author = 'a'.repeat(QUOTE_AUTHOR_MAX_LENGTH + 1)
    const req = { body: { ...validCreateBody, author } }
    const result = await runValidators(postQuoteValidators, req)

    expect(result.array()).toMatchObject([
      { path: 'author', msg: ERROR_MESSAGE.INVALID_QUOTE_AUTHOR },
    ])
  })

  test('rejects categories that are not an array', async () => {
    const req = { body: { ...validCreateBody, categories: 'life' } }
    const result = await runValidators(postQuoteValidators, req)

    expect(result.array()).toMatchObject([
      { path: 'categories', msg: ERROR_MESSAGE.INVALID_QUOTE_CATEGORIES },
    ])
  })

  test('removes duplicate categories from a create body', async () => {
    const req = {
      body: { ...validCreateBody, categories: ['life', 'work', 'life'] },
    }

    const result = await runValidators(postQuoteValidators, req)

    expect(result.isEmpty()).toBe(true)
    expect(req.body.categories).toEqual(['life', 'work'])
  })

  test('removes categories that differ only by surrounding spaces', async () => {
    const req = { body: { ...validCreateBody, categories: ['life', ' life '] } }
    const result = await runValidators(postQuoteValidators, req)

    expect(result.isEmpty()).toBe(true)
    expect(req.body.categories).toEqual(['life'])
  })

  test('accepts text of the maximum length', async () => {
    const req = {
      body: { ...validCreateBody, text: 'a'.repeat(QUOTE_TEXT_MAX_LENGTH) },
    }
    const result = await runValidators(postQuoteValidators, req)

    expect(result.isEmpty()).toBe(true)
  })

  test('rejects text longer than the maximum length', async () => {
    const req = {
      body: { ...validCreateBody, text: 'a'.repeat(QUOTE_TEXT_MAX_LENGTH + 1) },
    }
    const result = await runValidators(postQuoteValidators, req)

    expect(result.array()).toMatchObject([
      { path: 'text', msg: ERROR_MESSAGE.INVALID_QUOTE_TEXT },
    ])
  })

  test('accepts the maximum number of categories', async () => {
    const categories = Array.from(
      { length: MAX_CATEGORIES_PER_QUOTE },
      (_, index) => `category-${index}`,
    )
    const req = { body: { ...validCreateBody, categories } }
    const result = await runValidators(postQuoteValidators, req)

    expect(result.isEmpty()).toBe(true)
  })

  test('rejects more categories than the maximum', async () => {
    const categories = Array.from(
      { length: MAX_CATEGORIES_PER_QUOTE + 1 },
      (_, index) => `category-${index}`,
    )
    const req = { body: { ...validCreateBody, categories } }
    const result = await runValidators(postQuoteValidators, req)

    expect(result.array()).toMatchObject([
      { path: 'categories', msg: ERROR_MESSAGE.INVALID_QUOTE_CATEGORIES },
    ])
  })

  test('counts categories after removing duplicates', async () => {
    const categories = [
      ...Array.from(
        { length: MAX_CATEGORIES_PER_QUOTE },
        (_, index) => `category-${index}`,
      ),
      'category-0',
    ]
    const req = { body: { ...validCreateBody, categories } }
    const result = await runValidators(postQuoteValidators, req)

    expect(result.isEmpty()).toBe(true)
    expect(req.body.categories).toHaveLength(MAX_CATEGORIES_PER_QUOTE)
  })

  test('accepts a category name of the maximum length', async () => {
    const categories = ['a'.repeat(CATEGORY_NAME_MAX_LENGTH)]
    const req = { body: { ...validCreateBody, categories } }
    const result = await runValidators(postQuoteValidators, req)

    expect(result.isEmpty()).toBe(true)
  })

  test('rejects a category name longer than the maximum', async () => {
    const categories = ['a'.repeat(CATEGORY_NAME_MAX_LENGTH + 1)]
    const req = { body: { ...validCreateBody, categories } }
    const result = await runValidators(postQuoteValidators, req)

    expect(result.array()).toMatchObject([
      { path: 'categories[0]', msg: ERROR_MESSAGE.CATEGORY_NAME_TOO_LONG },
    ])
  })

  test('rejects quotes category query longer than the maximum', async () => {
    const req = { query: { category: 'a'.repeat(CATEGORY_NAME_MAX_LENGTH + 1) } }
    const result = await runValidators(getQuotesValidators, req)

    expect(result.array()).toMatchObject([
      { path: 'category', msg: ERROR_MESSAGE.CATEGORY_NAME_TOO_LONG },
    ])
  })

  test('rejects patch limits the same way as create', async () => {
    const req = {
      body: {
        categories: Array.from(
          { length: MAX_CATEGORIES_PER_QUOTE + 1 },
          (_, index) => `category-${index}`,
        ),
        text: 'a'.repeat(QUOTE_TEXT_MAX_LENGTH + 1),
      },
      params: { id: '1' },
    }
    const result = await runValidators(patchSingleQuoteValidators, req)

    expect(result.array()).toMatchObject([
      { path: 'text', msg: ERROR_MESSAGE.INVALID_QUOTE_TEXT },
      { path: 'categories', msg: ERROR_MESSAGE.INVALID_QUOTE_CATEGORIES },
    ])
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

  test('accepts patch with a single field', async () => {
    const req = {
      body: { author: 'Seneca' },
      params: { id: '3' },
    }

    const result = await runValidators(patchSingleQuoteValidators, req)

    expect(result.isEmpty()).toBe(true)
    expect(req.params.id).toBe(3)
  })

  test('rejects an empty patch body without a field path', async () => {
    const req = {
      body: {},
      params: { id: '3' },
    }

    const result = await runValidators(patchSingleQuoteValidators, req)

    expect(result.array()).toMatchObject([
      { path: '', msg: ERROR_MESSAGE.NOTHING_TO_UPDATE },
    ])
  })

  test('rejects a patch without a body', async () => {
    const req = { params: { id: '3' } }
    const result = await runValidators(patchSingleQuoteValidators, req)

    expect(result.array()).toMatchObject([
      { path: '', msg: ERROR_MESSAGE.NOTHING_TO_UPDATE },
    ])
  })

  test('rejects numeric text in a patch body', async () => {
    const req = {
      body: { text: 12345678901 },
      params: { id: '3' },
    }

    const result = await runValidators(patchSingleQuoteValidators, req)

    expect(result.array()).toMatchObject([
      { path: 'text', msg: ERROR_MESSAGE.INVALID_QUOTE_TEXT },
    ])
  })

  test('removes duplicate categories from a patch body', async () => {
    const req = {
      body: { categories: ['life', 'life'] },
      params: { id: '3' },
    }

    const result = await runValidators(patchSingleQuoteValidators, req)

    expect(result.isEmpty()).toBe(true)
    expect(req.body.categories).toEqual(['life'])
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
