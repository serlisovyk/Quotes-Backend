import { describe, expect, test, vi } from 'vitest'
import asyncHandler from './index.js'

describe('AsyncHandler Middleware', () => {
  test('runs async handler without calling next on success', async () => {
    const req = {}
    const res = {}
    const next = vi.fn()
    const handler = vi.fn().mockResolvedValue()

    await asyncHandler(handler)(req, res, next)

    expect(handler).toHaveBeenCalledWith(req, res, next)
    expect(next).not.toHaveBeenCalled()
  })

  test('passes thrown error to next', async () => {
    const error = new Error('Boom')
    const next = vi.fn()
    const handler = vi.fn().mockRejectedValue(error)

    await asyncHandler(handler)({}, {}, next)

    expect(next).toHaveBeenCalledWith(error)
  })
})
