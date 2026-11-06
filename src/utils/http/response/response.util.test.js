import { describe, expect, test } from 'vitest'
import { createResponseMock } from '#tests/mocks/response'
import {
  sendCreated,
  sendNoContent,
  sendOk,
  sendServiceUnavailable,
} from '#utils/http/response'
import { HTTP_STATUS } from '#constants'

describe('Response Util', () => {
  test('sends ok response', () => {
    const res = createResponseMock()
    const data = { status: 'ok' }

    sendOk(res, data)

    expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.OK)
    expect(res.json).toHaveBeenCalledWith(data)
  })

  test('sends created response with location', () => {
    const res = createResponseMock()
    const data = { id: 1 }

    sendCreated(res, data, '/quotes/1')

    expect(res.location).toHaveBeenCalledWith('/quotes/1')
    expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.CREATED)
    expect(res.json).toHaveBeenCalledWith(data)
  })

  test('sends created response without location', () => {
    const res = createResponseMock()
    const data = { id: 1 }

    sendCreated(res, data)

    expect(res.location).not.toHaveBeenCalled()
    expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.CREATED)
    expect(res.json).toHaveBeenCalledWith(data)
  })

  test('sends no content response', () => {
    const res = createResponseMock()

    sendNoContent(res)

    expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.NO_CONTENT)
    expect(res.send).toHaveBeenCalled()
  })

  test('sends service unavailable response', () => {
    const res = createResponseMock()
    const data = { status: 'error' }

    sendServiceUnavailable(res, data)

    expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.SERVICE_UNAVAILABLE)
    expect(res.json).toHaveBeenCalledWith(data)
  })
})
