import { describe, expect, test, vi } from 'vitest'
import { createResponseMock } from '#tests/mocks/response'
import cacheControlMiddleware from '#middlewares/cache-control'
import { CACHE_CONTROL, HEADER } from '#constants'

describe('CacheControl Middleware', () => {
  test('sets the given Cache-Control value and calls next', () => {
    const res = createResponseMock()
    const next = vi.fn()

    cacheControlMiddleware(CACHE_CONTROL.PUBLIC_SHORT)({}, res, next)

    expect(res.set).toHaveBeenCalledWith(
      HEADER.CACHE_CONTROL,
      CACHE_CONTROL.PUBLIC_SHORT,
    )
    expect(next).toHaveBeenCalledWith()
  })
})
