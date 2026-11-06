import { describe, expect, test } from 'vitest'
import { client, createQuote } from './helpers.js'
import { ERROR_CODE, ERROR_MESSAGE, HTTP_STATUS, ROUTE } from '#constants'

const QUOTE = {
  text: 'The only way to do great work is to love what you do',
  author: 'Steve Jobs',
  categories: ['work', 'passion'],
}

function sortedCategories(quote) {
  return [...quote.categories].sort()
}

describe('Quotes API (integration)', () => {
  describe('POST /quotes', () => {
    test('creates a quote with categories and points to it in Location', async () => {
      const response = await client.post(ROUTE.QUOTES).send(QUOTE)

      expect(response.status).toBe(HTTP_STATUS.CREATED)
      expect(response.headers.location).toBe(`${ROUTE.QUOTES}/${response.body.id}`)
      expect(response.body).toMatchObject({ text: QUOTE.text, author: QUOTE.author })
      expect(sortedCategories(response.body)).toEqual(['passion', 'work'])

      const stored = await client.get(`${ROUTE.QUOTES}/${response.body.id}`)

      expect(stored.status).toBe(HTTP_STATUS.OK)
      expect(stored.body).toEqual(response.body)
    })

    test('collapses duplicate categories and reuses existing ones', async () => {
      const first = await createQuote({ categories: ['life', 'life', 'hope'] })
      const second = await createQuote({ categories: ['life'] })

      expect(sortedCategories(first)).toEqual(['hope', 'life'])
      expect(second.categories).toEqual(['life'])

      const categories = await client.get(ROUTE.CATEGORIES)

      expect(categories.body.total).toBe(2)
    })

    test('answers 400 with the invalid fields', async () => {
      const response = await client
        .post(ROUTE.QUOTES)
        .send({ text: 'short', author: 'A', categories: [] })

      expect(response.status).toBe(HTTP_STATUS.BAD_REQUEST)
      expect(response.body.error.code).toBe(ERROR_CODE.VALIDATION_ERROR)
      expect(Object.keys(response.body.error.fields)).toEqual(
        expect.arrayContaining(['text', 'author', 'categories']),
      )

      const list = await client.get(ROUTE.QUOTES)

      expect(list.body.total).toBe(0)
    })
  })

  describe('GET /quotes', () => {
    test('answers an empty list on an empty database', async () => {
      const response = await client.get(ROUTE.QUOTES)

      expect(response.status).toBe(HTTP_STATUS.OK)
      expect(response.body).toEqual({ total: 0, quotes: [] })
    })

    test('paginates and reports the total', async () => {
      for (let index = 1; index <= 5; index += 1) {
        await createQuote({ text: `Numbered quote with the number ${index}` })
      }

      const response = await client.get(ROUTE.QUOTES).query({ limit: 2, offset: 2 })

      expect(response.status).toBe(HTTP_STATUS.OK)
      expect(response.body.total).toBe(5)
      expect(response.body.quotes.map(({ id }) => id)).toEqual([3, 4])
    })

    test('filters by author, text and the general search', async () => {
      await createQuote({ text: 'Stay hungry, stay foolish', author: 'Steve Jobs' })
      await createQuote({ text: 'Knowledge is power', author: 'Francis Bacon' })
      await createQuote({ text: 'Power tends to corrupt', author: 'Lord Acton' })

      const byAuthor = await client.get(ROUTE.QUOTES).query({ author: 'jobs' })
      const byText = await client.get(ROUTE.QUOTES).query({ text: 'knowledge' })
      const bySearchInText = await client
        .get(ROUTE.QUOTES)
        .query({ search: 'POWER' })
      const bySearchInAuthor = await client
        .get(ROUTE.QUOTES)
        .query({ search: 'bacon' })

      expect(byAuthor.body.total).toBe(1)
      expect(byAuthor.body.quotes[0].author).toBe('Steve Jobs')
      expect(byText.body.quotes.map(({ author }) => author)).toEqual([
        'Francis Bacon',
      ])
      expect(bySearchInText.body.total).toBe(2)
      expect(bySearchInAuthor.body.quotes.map(({ author }) => author)).toEqual([
        'Francis Bacon',
      ])
    })

    test('filters by category and keeps every category of the quote', async () => {
      await createQuote({ categories: ['life', 'hope'] })
      await createQuote({ categories: ['work'] })

      const response = await client.get(ROUTE.QUOTES).query({ category: 'life' })

      expect(response.body.total).toBe(1)
      expect(sortedCategories(response.body.quotes[0])).toEqual(['hope', 'life'])
    })

    test('sorts by author in both directions', async () => {
      await createQuote({ author: 'Bravo Author' })
      await createQuote({ author: 'Alpha Author' })
      await createQuote({ author: 'Charlie Author' })

      const asc = await client.get(ROUTE.QUOTES).query({ sort: 'author' })
      const desc = await client
        .get(ROUTE.QUOTES)
        .query({ sort: 'author', order: 'desc' })

      expect(asc.body.quotes.map(({ author }) => author)).toEqual([
        'Alpha Author',
        'Bravo Author',
        'Charlie Author',
      ])
      expect(desc.body.quotes.map(({ author }) => author)).toEqual([
        'Charlie Author',
        'Bravo Author',
        'Alpha Author',
      ])
    })

    test('answers 400 for an invalid query', async () => {
      const response = await client
        .get(ROUTE.QUOTES)
        .query({ limit: 0, sort: 'text' })

      expect(response.status).toBe(HTTP_STATUS.BAD_REQUEST)
      expect(Object.keys(response.body.error.fields)).toEqual(
        expect.arrayContaining(['limit', 'sort']),
      )
    })
  })

  describe('GET /quotes/:id', () => {
    test('answers 404 for an unknown id', async () => {
      const response = await client.get(`${ROUTE.QUOTES}/999`)

      expect(response.status).toBe(HTTP_STATUS.NOT_FOUND)
      expect(response.body).toEqual({
        error: {
          code: ERROR_CODE.NOT_FOUND,
          message: ERROR_MESSAGE.QUOTE_NOT_FOUND('999'),
        },
      })
    })

    test('answers 400 for an invalid id', async () => {
      const response = await client.get(`${ROUTE.QUOTES}/abc`)

      expect(response.status).toBe(HTTP_STATUS.BAD_REQUEST)
      expect(response.body.error.fields.id).toBe(ERROR_MESSAGE.INVALID_ENTITY_ID)
    })
  })

  describe('GET /quotes/random', () => {
    test('answers the stored quotes up to the limit', async () => {
      await createQuote({ author: 'First Author' })
      await createQuote({ author: 'Second Author' })

      const response = await client.get(`${ROUTE.QUOTES}/random`).query({ limit: 1 })

      expect(response.status).toBe(HTTP_STATUS.OK)
      expect(response.body).toHaveLength(1)
    })
  })

  describe('PATCH /quotes/:id', () => {
    test('updates the fields and replaces the categories', async () => {
      const quote = await createQuote({ categories: ['life', 'hope'] })

      const response = await client
        .patch(`${ROUTE.QUOTES}/${quote.id}`)
        .send({ author: 'New Author', categories: ['work'] })

      expect(response.status).toBe(HTTP_STATUS.OK)
      expect(response.body).toEqual({
        id: quote.id,
        text: quote.text,
        author: 'New Author',
        categories: ['work'],
      })

      const stored = await client.get(`${ROUTE.QUOTES}/${quote.id}`)

      expect(stored.body).toEqual(response.body)
    })

    test('keeps the categories when the body has none', async () => {
      const quote = await createQuote({ categories: ['life'] })

      const response = await client
        .patch(`${ROUTE.QUOTES}/${quote.id}`)
        .send({ text: 'A brand new text of the quote' })

      expect(response.body.text).toBe('A brand new text of the quote')
      expect(response.body.categories).toEqual(['life'])
    })

    test('answers 400 for an empty body and 404 for an unknown id', async () => {
      const quote = await createQuote()

      const empty = await client.patch(`${ROUTE.QUOTES}/${quote.id}`).send({})
      const unknown = await client
        .patch(`${ROUTE.QUOTES}/999`)
        .send({ author: 'New Author' })

      expect(empty.status).toBe(HTTP_STATUS.BAD_REQUEST)
      expect(unknown.status).toBe(HTTP_STATUS.NOT_FOUND)
    })
  })

  describe('DELETE /quotes/:id', () => {
    test('deletes the quote, then answers 404', async () => {
      const quote = await createQuote()

      const deleted = await client.delete(`${ROUTE.QUOTES}/${quote.id}`)
      const fetched = await client.get(`${ROUTE.QUOTES}/${quote.id}`)
      const deletedAgain = await client.delete(`${ROUTE.QUOTES}/${quote.id}`)

      expect(deleted.status).toBe(HTTP_STATUS.NO_CONTENT)
      expect(fetched.status).toBe(HTTP_STATUS.NOT_FOUND)
      expect(deletedAgain.status).toBe(HTTP_STATUS.NOT_FOUND)
    })
  })
})
