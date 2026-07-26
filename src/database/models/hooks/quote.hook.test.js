import { describe, expect, test } from 'vitest'
import { formatQuoteCategoriesAfterFind } from '#models/hooks'

function createQuote(categories) {
  return {
    Categories: categories,
    dataValues: {
      Categories: categories,
    },
  }
}

describe('Quote Hook', () => {
  test('formats categories for a single quote', () => {
    const quote = createQuote([{ name: 'life' }, { name: 'wisdom' }])

    formatQuoteCategoriesAfterFind(quote)

    expect(quote.dataValues.categories).toEqual(['life', 'wisdom'])
    expect(quote.dataValues).not.toHaveProperty('Categories')
  })

  test('formats categories for multiple quotes', () => {
    const firstQuote = createQuote([{ name: 'life' }])
    const secondQuote = createQuote([{ name: 'humor' }, { name: 'work' }])

    formatQuoteCategoriesAfterFind([firstQuote, secondQuote])

    expect(firstQuote.dataValues.categories).toEqual(['life'])
    expect(secondQuote.dataValues.categories).toEqual(['humor', 'work'])
  })

  test('keeps quote unchanged when categories are missing', () => {
    const quote = { dataValues: { id: 1, text: 'Quote text' } }

    formatQuoteCategoriesAfterFind(quote)

    expect(quote.dataValues).toEqual({ id: 1, text: 'Quote text' })
  })

  test('does nothing when result is empty', () => {
    expect(formatQuoteCategoriesAfterFind(null)).toBeUndefined()
  })
})
