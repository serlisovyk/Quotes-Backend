import { describe, expect, test } from 'vitest'
import { client, createQuote } from './helpers.js'
import { ERROR_CODE, HTTP_STATUS, ROUTE } from '#constants'

describe('Categories API (integration)', () => {
  test('answers { total, categories } with the categories of the quotes', async () => {
    await createQuote({ categories: ['life', 'hope'] })
    await createQuote({ categories: ['work'] })

    const response = await client.get(ROUTE.CATEGORIES)

    expect(response.status).toBe(HTTP_STATUS.OK)
    expect(response.body.total).toBe(3)
    expect(response.body.categories.map(({ name }) => name).sort()).toEqual([
      'hope',
      'life',
      'work',
    ])
  })

  test('filters by name and paginates', async () => {
    await createQuote({ categories: ['life', 'lifestyle', 'work'] })

    const byName = await client.get(ROUTE.CATEGORIES).query({ name: 'LIFE' })
    const page = await client.get(ROUTE.CATEGORIES).query({ limit: 1, offset: 1 })

    expect(byName.body.total).toBe(2)
    expect(page.body.total).toBe(3)
    expect(page.body.categories).toHaveLength(1)
  })

  test('answers a category by id, 404 for an unknown one', async () => {
    await createQuote({ categories: ['life'] })

    const found = await client.get(`${ROUTE.CATEGORIES}/1`)
    const missing = await client.get(`${ROUTE.CATEGORIES}/999`)

    expect(found.status).toBe(HTTP_STATUS.OK)
    expect(found.body).toEqual({ id: 1, name: 'life' })
    expect(missing.status).toBe(HTTP_STATUS.NOT_FOUND)
    expect(missing.body.error.code).toBe(ERROR_CODE.NOT_FOUND)
  })

  test('answers 400 for an invalid name', async () => {
    const response = await client.get(ROUTE.CATEGORIES).query({ name: 'bad name!' })

    expect(response.status).toBe(HTTP_STATUS.BAD_REQUEST)
    expect(response.body.error.code).toBe(ERROR_CODE.VALIDATION_ERROR)
  })
})
