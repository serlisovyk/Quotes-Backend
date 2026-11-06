import { describe, expect, test } from 'vitest'
import { createResponseMock } from '#tests/mocks/response'
import { getRoot } from '#controllers/root'
import { API_INFO, HTTP_STATUS } from '#constants'

describe('Root Controller', () => {
  test('sends the welcome message with the endpoints', () => {
    const res = createResponseMock()

    getRoot({}, res)

    expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.OK)
    expect(res.json).toHaveBeenCalledWith(API_INFO)
  })
})
