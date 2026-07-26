import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import {
  buildRequestLogMessage,
  logRequest,
  shouldSkipRequestLog,
} from '../../utils/http/request-log/index.js'
import requestLoggerMiddleware from './index.js'

vi.mock('../../utils/http/request-log/index.js', () => ({
  buildRequestLogMessage: vi.fn(),
  logRequest: vi.fn(),
  shouldSkipRequestLog: vi.fn(),
}))

function createResponse(statusCode = 200) {
  return {
    statusCode,
    on: vi.fn(),
  }
}

describe('RequestLogger Middleware', () => {
  beforeEach(() => vi.clearAllMocks())
  afterEach(() => vi.restoreAllMocks())

  test('skips logging when request should be ignored', () => {
    const req = { method: 'GET', originalUrl: '/health' }
    const res = createResponse()
    const next = vi.fn()

    shouldSkipRequestLog.mockReturnValue(true)

    requestLoggerMiddleware(req, res, next)

    expect(next).toHaveBeenCalled()
    expect(res.on).not.toHaveBeenCalled()
  })

  test('logs request after response finish', () => {
    const req = { method: 'GET', originalUrl: '/quotes' }
    const res = createResponse(201)
    const next = vi.fn()
    const dateNowSpy = vi
      .spyOn(Date, 'now')
      .mockReturnValueOnce(100)
      .mockReturnValueOnce(145)

    let finishHandler

    shouldSkipRequestLog.mockReturnValue(false)

    buildRequestLogMessage.mockReturnValue('GET /quotes 201 45ms')

    res.on.mockImplementation((event, handler) => {
      finishHandler = handler
    })

    requestLoggerMiddleware(req, res, next)

    finishHandler()

    expect(next).toHaveBeenCalled()
    expect(res.on).toHaveBeenCalledWith('finish', expect.any(Function))
    expect(buildRequestLogMessage).toHaveBeenCalledWith(req, res, 45)
    expect(logRequest).toHaveBeenCalledWith('GET /quotes 201 45ms', 201)
    expect(dateNowSpy).toHaveBeenCalledTimes(2)
  })
})
