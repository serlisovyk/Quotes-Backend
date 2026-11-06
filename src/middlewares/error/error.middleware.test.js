import { beforeEach, describe, expect, test, vi } from 'vitest'
import { createResponseMock } from '#tests/mocks/response'
import AppError from '#errors/classes/app'
import Logger from '#logger'
import errorMiddleware from '#middlewares/error'
import {
  CACHE_CONTROL,
  ERROR_CODE,
  ERROR_MESSAGE,
  HEADER,
  HTTP_STATUS,
} from '#constants'

vi.mock('#logger', () => ({
  default: {
    error: vi.fn(),
  },
}))

describe('Error Middleware', () => {
  beforeEach(() => vi.clearAllMocks())

  test('sends AppError response without logging it', () => {
    const error = new AppError({
      statusCode: HTTP_STATUS.BAD_REQUEST,
      code: ERROR_CODE.BAD_REQUEST,
      message: 'Bad request',
    })
    const res = createResponseMock()

    errorMiddleware(error, {}, res, vi.fn())

    expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.BAD_REQUEST)
    expect(res.json).toHaveBeenCalledWith(error.toResponse())
    expect(Logger.error).not.toHaveBeenCalled()
  })

  test('marks the error response as not cacheable', () => {
    const error = new AppError({
      statusCode: HTTP_STATUS.NOT_FOUND,
      code: ERROR_CODE.NOT_FOUND,
      message: 'Not found',
    })
    const res = createResponseMock()

    errorMiddleware(error, {}, res, vi.fn())

    expect(res.set).toHaveBeenCalledWith(
      HEADER.CACHE_CONTROL,
      CACHE_CONTROL.NO_STORE,
    )
  })

  test('normalizes invalid JSON error without logging it', () => {
    const error = new SyntaxError('Unexpected token')
    error.status = HTTP_STATUS.BAD_REQUEST
    error.body = '{'
    const res = createResponseMock()

    errorMiddleware(error, {}, res, vi.fn())

    expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.BAD_REQUEST)
    expect(res.json).toHaveBeenCalledWith({
      error: {
        code: ERROR_CODE.INVALID_JSON,
        message: ERROR_MESSAGE.INVALID_JSON,
      },
    })
    expect(Logger.error).not.toHaveBeenCalled()
  })

  test.each([
    [
      'entity.too.large',
      HTTP_STATUS.PAYLOAD_TOO_LARGE,
      ERROR_CODE.PAYLOAD_TOO_LARGE,
      ERROR_MESSAGE.PAYLOAD_TOO_LARGE,
    ],
    [
      'charset.unsupported',
      HTTP_STATUS.UNSUPPORTED_MEDIA_TYPE,
      ERROR_CODE.UNSUPPORTED_MEDIA_TYPE,
      ERROR_MESSAGE.UNSUPPORTED_MEDIA_TYPE,
    ],
    [
      'encoding.unsupported',
      HTTP_STATUS.UNSUPPORTED_MEDIA_TYPE,
      ERROR_CODE.UNSUPPORTED_MEDIA_TYPE,
      ERROR_MESSAGE.UNSUPPORTED_MEDIA_TYPE,
    ],
  ])(
    'normalizes %s body parser error without logging it',
    (type, status, code, message) => {
      const error = Object.assign(new Error('body parser error'), { status, type })
      const res = createResponseMock()

      errorMiddleware(error, {}, res, vi.fn())

      expect(res.status).toHaveBeenCalledWith(status)
      expect(res.json).toHaveBeenCalledWith({ error: { code, message } })
      expect(Logger.error).not.toHaveBeenCalled()
    },
  )

  test('normalizes unknown error and logs it', () => {
    const error = new Error('Database is down')
    const res = createResponseMock()

    errorMiddleware(error, {}, res, vi.fn())

    expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.INTERNAL_SERVER_ERROR)
    expect(res.json).toHaveBeenCalledWith({
      error: {
        code: ERROR_CODE.INTERNAL_SERVER_ERROR,
        message: ERROR_MESSAGE.INTERNAL_SERVER_ERROR,
      },
    })
    expect(Logger.error).toHaveBeenCalledWith('Unhandled application error', error)
  })
})
