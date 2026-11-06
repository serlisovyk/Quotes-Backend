import { describe, expect, test } from 'vitest'
import { ERROR_CODE, HTTP_STATUS } from '#constants'
import AppError from '#errors/classes/app'

describe('App Error', () => {
  test('creates operational error', () => {
    const error = new AppError({
      statusCode: HTTP_STATUS.BAD_REQUEST,
      code: ERROR_CODE.BAD_REQUEST,
      message: 'Invalid request',
    })

    expect(error.name).toBe('AppError')
    expect(error.statusCode).toBe(HTTP_STATUS.BAD_REQUEST)
    expect(error.code).toBe(ERROR_CODE.BAD_REQUEST)
    expect(error.message).toBe('Invalid request')
    expect(error.isOperational).toBe(true)
  })

  test('serializes error response without fields', () => {
    const error = new AppError({
      statusCode: HTTP_STATUS.BAD_REQUEST,
      code: ERROR_CODE.BAD_REQUEST,
      message: 'Invalid request',
    })

    expect(error.toResponse()).toEqual({
      error: {
        code: ERROR_CODE.BAD_REQUEST,
        message: 'Invalid request',
      },
    })
  })

  test('serializes error response with fields', () => {
    const fields = { limit: 'Invalid limit' }
    const error = new AppError({
      statusCode: HTTP_STATUS.BAD_REQUEST,
      code: ERROR_CODE.VALIDATION_ERROR,
      message: 'Invalid data',
      fields,
    })

    expect(error.toResponse()).toEqual({
      error: {
        code: ERROR_CODE.VALIDATION_ERROR,
        message: 'Invalid data',
        fields,
      },
    })
  })
})
