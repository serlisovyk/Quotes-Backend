import ErrorFactory from '#errors/factories/error'
import Logger from '#logger'

function errorMiddleware(err, _req, res, _next) {
  const appError = ErrorFactory.from(err)

  if (ErrorFactory.shouldLog(err)) {
    Logger.error('Unhandled application error', err)
  }

  const response = appError.toResponse()

  return res.status(appError.statusCode).json(response)
}

export default errorMiddleware
