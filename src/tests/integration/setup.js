import { afterAll, beforeAll, beforeEach, vi } from 'vitest'
import sequelize from '#database'
import '#models'

// A suite makes more writes than the production limit allows; the limiters have their own unit tests.
vi.mock('#middlewares/rate-limit', () => {
  const passThrough = (_req, _res, next) => next()

  return {
    createRateLimiter: () => passThrough,
    generalRateLimiter: passThrough,
    writeRateLimiter: passThrough,
  }
})

beforeAll(() => sequelize.sync())

beforeEach(() => sequelize.truncate({ cascade: true, restartIdentity: true }))

afterAll(() => sequelize.close())
