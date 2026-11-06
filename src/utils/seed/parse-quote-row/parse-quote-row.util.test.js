import { describe, expect, test } from 'vitest'
import parseQuoteRow from '#utils/seed/parse-quote-row'

describe('ParseQuoteRow Util', () => {
  test('returns null when categories are invalid', () => {
    expect(
      parseQuoteRow({
        author: 'Author',
        category: 'bad category',
        quote: 'Quote text',
      }),
    ).toBeNull()
  })

  test('returns quote fields and split categories', () => {
    expect(
      parseQuoteRow({
        author: 'Author, Source',
        category: 'life,work',
        quote: 'Quote text',
      }),
    ).toEqual({
      text: 'Quote text',
      author: 'Author',
      categories: ['life', 'work'],
    })
  })

  test('truncates author to 255 characters', () => {
    const row = parseQuoteRow({
      author: 'a'.repeat(300),
      category: 'life',
      quote: 'Quote text',
    })

    expect(row.author).toHaveLength(255)
  })
})
