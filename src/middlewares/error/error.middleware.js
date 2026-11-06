import ErrorFactory from '#errors/factories/error'
import Logger from '#logger'
import { CACHE_CONTROL, HEADER } from '#constants'

function errorMiddleware(err, _req, res, _next) {
  const appError = ErrorFactory.from(err)

  if (ErrorFactory.shouldLog(err)) {
    Logger.error('Unhandled application error', err)
  }

  const response = appError.toResponse()

  res.set(HEADER.CACHE_CONTROL, CACHE_CONTROL.NO_STORE)

  return res.status(appError.statusCode).json(response)
}

export default errorMiddleware
