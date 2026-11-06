import { describe, expect, test } from 'vitest'
import { createResponseMock } from '#tests/mocks/response'
import { getHealth } from '#controllers/health'
import { HTTP_STATUS } from '#constants'

describe('Health Controller', () => {
  test('returns ok status payload', () => {
    const res = createResponseMock()

    getHealth({}, res)

    expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.OK)
    expect(res.json).toHaveBeenCalledWith({ status: 'ok' })
  })
})
