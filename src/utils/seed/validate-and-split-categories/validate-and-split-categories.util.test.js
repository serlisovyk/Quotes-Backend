import { describe, expect, test } from 'vitest'
import validateAndSplitCategories from '#utils/seed/validate-and-split-categories'
import { CATEGORY_NAME_MAX_LENGTH, MAX_CATEGORIES_PER_QUOTE } from '#constants'

describe('ValidateAndSplitCategories Util', () => {
  test('returns empty array when categories string is missing', () => {
    expect(validateAndSplitCategories()).toEqual([])
  })

  test('splits and trims categories', () => {
    expect(validateAndSplitCategories('life, work,focus')).toEqual([
      'life',
      'work',
      'focus',
    ])
  })

  test('filters empty category chunks', () => {
    expect(validateAndSplitCategories('life,, work,')).toEqual(['life', 'work'])
  })

  test('rejects categories with spaces', () => {
    expect(validateAndSplitCategories('life,hard work')).toEqual([])
  })

  test('rejects categories longer than the maximum length', () => {
    const longCategory = 'a'.repeat(CATEGORY_NAME_MAX_LENGTH + 1)

    expect(validateAndSplitCategories(`life,${longCategory}`)).toEqual([])
  })

  test('keeps only the first categories above the maximum count', () => {
    const categories = Array.from(
      { length: MAX_CATEGORIES_PER_QUOTE + 2 },
      (_, index) => `category-${index}`,
    )

    const result = validateAndSplitCategories(categories.join(','))

    expect(result).toEqual(categories.slice(0, MAX_CATEGORIES_PER_QUOTE))
  })

  test('rejects categories with uppercase letters', () => {
    expect(validateAndSplitCategories('life,Work')).toEqual([])
  })
})
