import rateLimit from 'express-rate-limit'
import { TooManyRequestsError } from '#errors/classes'
import {
  ERROR_MESSAGE,
  MINUTES_IN_MS,
  RATE_LIMIT_MAX_REQUESTS,
  WRITE_RATE_LIMIT_MAX_REQUESTS,
} from '#constants'

export function createRateLimiter({ windowMs, limit }) {
  return rateLimit({
    windowMs,
    limit,
    standardHeaders: 'draft-6',
    legacyHeaders: false,
    handler: (_req, _res, next) =>
      next(new TooManyRequestsError(ERROR_MESSAGE.TOO_MANY_REQUESTS)),
  })
}

export const generalRateLimiter = createRateLimiter({
  windowMs: MINUTES_IN_MS.FIFTEEN,
  limit: RATE_LIMIT_MAX_REQUESTS,
})

export const writeRateLimiter = createRateLimiter({
  windowMs: MINUTES_IN_MS.FIFTEEN,
  limit: WRITE_RATE_LIMIT_MAX_REQUESTS,
})
