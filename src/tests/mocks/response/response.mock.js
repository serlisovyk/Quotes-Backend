import { vi } from 'vitest'

export function createResponseMock() {
  return {
    json: vi.fn().mockReturnThis(),
    location: vi.fn().mockReturnThis(),
    send: vi.fn().mockReturnThis(),
    set: vi.fn().mockReturnThis(),
    status: vi.fn().mockReturnThis(),
  }
}
