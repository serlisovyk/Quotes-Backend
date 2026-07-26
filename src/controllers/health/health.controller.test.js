import { describe, expect, test } from 'vitest'
import { HTTP_STATUS } from '../../constants/app.constant.js'
import { createResponseMock } from '../../tests/mocks/response/index.js'
import { getHealth } from './index.js'

describe('Health Controller', () => {
  test('returns ok status payload', () => {
    const res = createResponseMock()

    getHealth({}, res)

    expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.OK)
    expect(res.json).toHaveBeenCalledWith({ status: 'ok' })
  })
})
