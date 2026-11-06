import { beforeEach, describe, expect, test, vi } from 'vitest'
import Logger from '#logger'
import {
  buildRequestLogMessage,
  logRequest,
  shouldSkipRequestLog,
} from '#utils/http/request-log'
import { HTTP_STATUS, ROUTE, SKIPPED_REQUEST_LOG_ROUTES } from '#constants'

vi.mock('#logger', () => ({
  default: {
    error: vi.fn(),
    success: vi.fn(),
    warn: vi.fn(),
  },
}))

describe('RequestLog Util', () => {
  beforeEach(() => vi.clearAllMocks())

  test('skips configured routes', () => {
    expect(SKIPPED_REQUEST_LOG_ROUTES).toContain(ROUTE.HEALTH)
    expect(shouldSkipRequestLog({ path: ROUTE.HEALTH })).toBe(true)
  })

  test('does not skip regular routes', () => {
    expect(shouldSkipRequestLog({ path: ROUTE.QUOTES })).toBe(false)
  })

  test('builds request log message', () => {
    expect(
      buildRequestLogMessage(
        { method: 'GET', originalUrl: '/quotes?limit=1' },
        { statusCode: HTTP_STATUS.OK },
        42,
      ),
    ).toBe('GET /quotes?limit=1 200 42ms')
  })

  test('logs successful response as success', () => {
    logRequest('GET /quotes 200 1ms', HTTP_STATUS.OK)

    expect(Logger.success).toHaveBeenCalledWith('GET /quotes 200 1ms')
    expect(Logger.warn).not.toHaveBeenCalled()
    expect(Logger.error).not.toHaveBeenCalled()
  })

  test('logs client error response as warning', () => {
    logRequest('GET /missing 404 1ms', HTTP_STATUS.NOT_FOUND)

    expect(Logger.warn).toHaveBeenCalledWith('GET /missing 404 1ms')
    expect(Logger.success).not.toHaveBeenCalled()
    expect(Logger.error).not.toHaveBeenCalled()
  })

  test('logs server error response as error', () => {
    logRequest('GET /quotes 500 1ms', HTTP_STATUS.INTERNAL_SERVER_ERROR)

    expect(Logger.error).toHaveBeenCalledWith('GET /quotes 500 1ms')
    expect(Logger.success).not.toHaveBeenCalled()
    expect(Logger.warn).not.toHaveBeenCalled()
  })
})
