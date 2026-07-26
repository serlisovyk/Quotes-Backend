import { describe, expect, test } from 'vitest'
import validateAndSplitCategories from './index.js'

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

  test('rejects categories with uppercase letters', () => {
    expect(validateAndSplitCategories('life,Work')).toEqual([])
  })
})
