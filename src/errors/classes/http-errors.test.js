import { describe, expect, test } from 'vitest'
import { HTTP_STATUS, ERROR_CODE } from '#constants'
import BadRequestError from './bad-request.error.js'
import InternalServerError from './internal-server.error.js'
import InvalidJsonError from './invalid-json.error.js'
import NotFoundError from './not-found.error.js'
import PayloadTooLargeError from './payload-too-large.error.js'
import TooManyRequestsError from './too-many-requests.error.js'
import UnsupportedMediaTypeError from './unsupported-media-type.error.js'
import ValidationError from './validation.error.js'

describe('Http Errors', () => {
  test('creates bad request error', () => {
    const error = new BadRequestError('Bad request')

    expect(error.statusCode).toBe(HTTP_STATUS.BAD_REQUEST)
    expect(error.code).toBe(ERROR_CODE.BAD_REQUEST)
  })

  test('creates validation error with fields', () => {
    const fields = { text: 'Text is required' }
    const error = new ValidationError('Invalid request data', fields)

    expect(error.statusCode).toBe(HTTP_STATUS.BAD_REQUEST)
    expect(error.code).toBe(ERROR_CODE.VALIDATION_ERROR)
    expect(error.fields).toEqual(fields)
  })

  test('creates invalid json error', () => {
    const error = new InvalidJsonError('Invalid JSON')

    expect(error.statusCode).toBe(HTTP_STATUS.BAD_REQUEST)
    expect(error.code).toBe(ERROR_CODE.INVALID_JSON)
  })

  test('creates not found error', () => {
    const error = new NotFoundError('Not found')

    expect(error.statusCode).toBe(HTTP_STATUS.NOT_FOUND)
    expect(error.code).toBe(ERROR_CODE.NOT_FOUND)
  })

  test('creates payload too large error', () => {
    const error = new PayloadTooLargeError('Payload too large')

    expect(error.statusCode).toBe(HTTP_STATUS.PAYLOAD_TOO_LARGE)
    expect(error.code).toBe(ERROR_CODE.PAYLOAD_TOO_LARGE)
  })

  test('creates unsupported media type error', () => {
    const error = new UnsupportedMediaTypeError('Unsupported media type')

    expect(error.statusCode).toBe(HTTP_STATUS.UNSUPPORTED_MEDIA_TYPE)
    expect(error.code).toBe(ERROR_CODE.UNSUPPORTED_MEDIA_TYPE)
  })

  test('creates too many requests error', () => {
    const error = new TooManyRequestsError('Too many requests')

    expect(error.statusCode).toBe(HTTP_STATUS.TOO_MANY_REQUESTS)
    expect(error.code).toBe(ERROR_CODE.TOO_MANY_REQUESTS)
  })

  test('creates internal server error', () => {
    const error = new InternalServerError('Unexpected error')

    expect(error.statusCode).toBe(HTTP_STATUS.INTERNAL_SERVER_ERROR)
    expect(error.code).toBe(ERROR_CODE.INTERNAL_SERVER_ERROR)
  })
})
