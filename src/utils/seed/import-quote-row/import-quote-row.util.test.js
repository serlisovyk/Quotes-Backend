import { beforeEach, describe, expect, test, vi } from 'vitest'
import { Quote } from '#models'
import { findOrCreateCategories } from '#services/categories'
import importQuoteRow from '#utils/seed/import-quote-row'

vi.mock('#models', () => ({
  Quote: {
    create: vi.fn(),
  },
}))

vi.mock('#services/categories', () => ({
  findOrCreateCategories: vi.fn(),
}))

describe('ImportQuoteRow Util', () => {
  beforeEach(() => vi.clearAllMocks())

  test('skips row when categories are invalid', async () => {
    await importQuoteRow({
      author: 'Author',
      category: 'bad category',
      quote: 'Quote text',
    })

    expect(Quote.create).not.toHaveBeenCalled()
    expect(findOrCreateCategories).not.toHaveBeenCalled()
  })

  test('imports quote row and attaches categories', async () => {
    const quote = {
      addCategories: vi.fn(),
    }
    const categories = [{ id: 1, name: 'life' }]

    Quote.create.mockResolvedValue(quote)
    findOrCreateCategories.mockResolvedValue(categories)

    await importQuoteRow({
      author: 'Author, Source',
      category: 'life,work',
      quote: 'Quote text',
    })

    expect(Quote.create).toHaveBeenCalledWith({
      text: 'Quote text',
      author: 'Author',
    })
    expect(findOrCreateCategories).toHaveBeenCalledWith(['life', 'work'])
    expect(quote.addCategories).toHaveBeenCalledWith(categories)
  })

  test('truncates author to 255 characters', async () => {
    const quote = {
      addCategories: vi.fn(),
    }
    const longAuthor = 'a'.repeat(300)

    Quote.create.mockResolvedValue(quote)
    findOrCreateCategories.mockResolvedValue([])

    await importQuoteRow({
      author: longAuthor,
      category: 'life',
      quote: 'Quote text',
    })

    expect(Quote.create.mock.calls[0][0].author).toHaveLength(255)
  })
})
