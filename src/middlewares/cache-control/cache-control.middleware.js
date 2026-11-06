import { HEADER } from '#constants'

function cacheControlMiddleware(value) {
  return (_, res, next) => {
    res.set(HEADER.CACHE_CONTROL, value)

    next()
  }
}

export default cacheControlMiddleware
