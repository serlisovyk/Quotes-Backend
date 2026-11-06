import { describe, expect, test } from 'vitest'
import AppError from '#errors/classes/app'
import {
  InternalServerError,
  InvalidJsonError,
  PayloadTooLargeError,
  UnsupportedMediaTypeError,
} from '#errors/classes'
import ErrorFactory from '#errors/factories/error'
import { ERROR_CODE, ERROR_MESSAGE } from '#constants'

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

  test('converts too large body error to PayloadTooLargeError', () => {
    const error = Object.assign(new Error('request entity too large'), {
      status: 413,
      type: 'entity.too.large',
    })

    const result = ErrorFactory.from(error)

    expect(result).toBeInstanceOf(PayloadTooLargeError)
    expect(result.message).toBe(ERROR_MESSAGE.PAYLOAD_TOO_LARGE)
  })

  test.each(['charset.unsupported', 'encoding.unsupported'])(
    'converts %s error to UnsupportedMediaTypeError',
    (type) => {
      const error = Object.assign(new Error('unsupported'), { status: 415, type })

      const result = ErrorFactory.from(error)

      expect(result).toBeInstanceOf(UnsupportedMediaTypeError)
      expect(result.message).toBe(ERROR_MESSAGE.UNSUPPORTED_MEDIA_TYPE)
    },
  )

  test('leaves other body parser errors as InternalServerError', () => {
    const error = Object.assign(new Error('verify failed'), {
      status: 403,
      type: 'entity.verify.failed',
    })

    expect(ErrorFactory.from(error)).toBeInstanceOf(InternalServerError)
    expect(ErrorFactory.shouldLog(error)).toBe(true)
  })

  test('converts unknown error to InternalServerError', () => {
    const result = ErrorFactory.from(new Error('Database is down'))

    expect(result).toBeInstanceOf(InternalServerError)
    expect(result.message).toBe(ERROR_MESSAGE.INTERNAL_SERVER_ERROR)
  })

  test('logs only unknown errors, not expected request errors', () => {
    const invalidJsonError = new SyntaxError('Unexpected token')
    invalidJsonError.status = 400
    invalidJsonError.body = '{'

    expect(ErrorFactory.shouldLog(new Error('Unknown'))).toBe(true)
    expect(ErrorFactory.shouldLog(new AppError({ statusCode: 400 }))).toBe(false)
    expect(ErrorFactory.shouldLog(invalidJsonError)).toBe(false)
    expect(ErrorFactory.shouldLog({ type: 'entity.too.large' })).toBe(false)
    expect(ErrorFactory.shouldLog({ type: 'charset.unsupported' })).toBe(false)
  })
})
