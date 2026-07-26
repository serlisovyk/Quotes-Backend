import { describe, expect, test, vi } from 'vitest'
import { ERROR_CODE, ERROR_MESSAGE } from '../../constants/errors.constant.js'
import NotFoundError from '../../errors/classes/not-found.error.js'
import notFoundMiddleware from './index.js'

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
