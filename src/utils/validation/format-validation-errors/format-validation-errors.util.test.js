import { describe, expect, test } from 'vitest'
import { VALIDATION_ROOT_FIELD } from '#constants/validation.constant'
import formatValidationErrors from '#utils/validation/format-validation-errors'

function createValidationErrors(errors) {
  return {
    array() {
      return errors
    },
  }
}

describe('FormatValidationErrorsUtil', () => {
  test('formats validation errors by field path', () => {
    const errors = createValidationErrors([
      { path: 'limit', msg: 'Invalid limit' },
      { path: 'author', msg: 'Invalid author' },
    ])

    expect(formatValidationErrors(errors)).toEqual({
      limit: 'Invalid limit',
      author: 'Invalid author',
    })
  })

  test('uses root field when path is empty', () => {
    const errors = createValidationErrors([{ path: '', msg: 'Invalid body' }])

    expect(formatValidationErrors(errors)).toEqual({
      [VALIDATION_ROOT_FIELD]: 'Invalid body',
    })
  })
})
