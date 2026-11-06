import { describe, expect, test, vi } from 'vitest'
import { NotFoundError } from '#errors/classes'
import { ERROR_CODE, ERROR_MESSAGE } from '#constants'
import notFoundMiddleware from '#middlewares/not-found'

describe('NotFound Middleware', () => {
  test('passes route not found error to next', () => {
    const req = { method: 'GET', originalUrl: '/missing' }
    const next = vi.fn()

    notFoundMiddleware(req, {}, next)

    expect(next).toHaveBeenCalledWith(expect.any(NotFoundError))
    expect(next.mock.calls[0][0]).toMatchObject({
      code: ERROR_CODE.NOT_FOUND,
      message: ERROR_MESSAGE.ROUTE_NOT_FOUND('GET', '/missing'),
    })
  })
})
