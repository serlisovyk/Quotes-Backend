import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import pauseStream from '#utils/seed/pause-stream'

describe('PauseStream Util', () => {
  beforeEach(() => vi.useFakeTimers())

  afterEach(() => vi.useRealTimers())

  test('pauses stream and resumes it after timeout', async () => {
    const stream = {
      pause: vi.fn(),
      resume: vi.fn(),
    }

    const promise = pauseStream(stream, 1000)

    expect(stream.pause).toHaveBeenCalled()
    expect(stream.resume).not.toHaveBeenCalled()

    await vi.advanceTimersByTimeAsync(1000)
    await promise

    expect(stream.resume).toHaveBeenCalled()
  })
})
