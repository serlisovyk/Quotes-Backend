import { describe, expect, test } from 'vitest'
import removeDuplicateCategories from '#utils/validation/remove-duplicate-categories'

describe('removeDuplicateCategories', () => {
  test('removes repeated names and keeps the first occurrence order', () => {
    const result = removeDuplicateCategories(['life', 'work', 'life', 'work'])

    expect(result).toEqual(['life', 'work'])
  })

  test('returns a list without repeats unchanged', () => {
    const result = removeDuplicateCategories(['life', 'work'])

    expect(result).toEqual(['life', 'work'])
  })

  test('leaves a value that is not an array untouched', () => {
    expect(removeDuplicateCategories('life')).toBe('life')
    expect(removeDuplicateCategories(undefined)).toBeUndefined()
  })
})
