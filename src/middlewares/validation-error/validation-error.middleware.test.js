import { beforeEach, describe, expect, test, vi } from 'vitest'
import { validationResult } from 'express-validator'
import { ERROR_CODE, ERROR_MESSAGE } from '../../constants/errors.constant.js'
import ValidationError from '../../errors/classes/validation.error.js'
import validationErrorHandler from './index.js'

vi.mock('express-validator', () => ({
  validationResult: vi.fn(),
}))

describe('ValidationError Middleware', () => {
  beforeEach(() => vi.clearAllMocks())

  test('calls next without error when validation passed', () => {
    const next = vi.fn()

    validationResult.mockReturnValue({ isEmpty: () => true })

    validationErrorHandler({}, {}, next)

    expect(next).toHaveBeenCalledWith()
  })

  test('passes validation error to next when validation failed', () => {
    const next = vi.fn()

    validationResult.mockReturnValue({
      isEmpty: () => false,
      array: () => [{ path: 'limit', msg: 'Invalid limit' }],
    })

    validationErrorHandler({}, {}, next)

    expect(next).toHaveBeenCalledWith(expect.any(ValidationError))
    expect(next.mock.calls[0][0]).toMatchObject({
      code: ERROR_CODE.VALIDATION_ERROR,
      message: ERROR_MESSAGE.INVALID_REQUEST_DATA,
      fields: { limit: 'Invalid limit' },
    })
  })
})
