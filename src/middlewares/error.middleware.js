import ErrorFactory from '../errors/factories/error.factory.js'
import Logger from '../logger/logger.service.js'

function errorMiddleware(err, _, res, __) {
  const appError = ErrorFactory.from(err)

  if (ErrorFactory.shouldLog(err)) {
    Logger.error('Unhandled application error', err)
  }

  return res.status(appError.statusCode).json(appError.toResponse())
}

export default errorMiddleware
