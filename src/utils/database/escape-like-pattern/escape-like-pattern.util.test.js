import { describe, expect, test } from 'vitest'
import escapeLikePattern from '#utils/database/escape-like-pattern'

describe('EscapeLikePattern Util', () => {
  test('escapes LIKE wildcard characters', () => {
    expect(escapeLikePattern('50%_\\')).toBe('50\\%\\_\\\\')
  })

  test('converts non-string values before escaping', () => {
    expect(escapeLikePattern(123)).toBe('123')
  })
})
