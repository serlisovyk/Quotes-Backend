import { describe, expect, test } from 'vitest'
import { ERROR_CODE, ERROR_MESSAGE } from '#constants/errors.constant'
import AppError from '#errors/classes/app'
import InternalServerError from '#error-classes/internal-server'
import InvalidJsonError from '#error-classes/invalid-json'
import ErrorFactory from '#errors/factories/error'

describe('Error Factory', () => {
  test('returns AppError instances unchanged', () => {
    const error = new AppError({
      statusCode: 400,
      code: ERROR_CODE.BAD_REQUEST,
      message: 'Bad request',
    })

    expect(ErrorFactory.from(error)).toBe(error)
  })

  test('converts invalid JSON syntax error to InvalidJsonError', () => {
    const error = new SyntaxError('Unexpected token')
    error.status = 400
    error.body = '{'

    const result = ErrorFactory.from(error)

    expect(result).toBeInstanceOf(InvalidJsonError)
    expect(result.message).toBe(ERROR_MESSAGE.INVALID_JSON)
  })

  test('converts unknown error to InternalServerError', () => {
    const result = ErrorFactory.from(new Error('Database is down'))

    expect(result).toBeInstanceOf(InternalServerError)
    expect(result.message).toBe(ERROR_MESSAGE.INTERNAL_SERVER_ERROR)
  })

  test('logs only unknown non-json errors', () => {
    const invalidJsonError = new SyntaxError('Unexpected token')
    invalidJsonError.status = 400
    invalidJsonError.body = '{'

    expect(ErrorFactory.shouldLog(new Error('Unknown'))).toBe(true)
    expect(ErrorFactory.shouldLog(new AppError({ statusCode: 400 }))).toBe(false)
    expect(ErrorFactory.shouldLog(invalidJsonError)).toBe(false)
  })
})
