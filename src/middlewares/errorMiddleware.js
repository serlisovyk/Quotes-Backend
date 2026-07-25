import ErrorFactory from '../errors/factories/ErrorFactory.js'
import Logger from '../logger/logger.js'

const errorMiddleware = (err, _, res, __) => {
  const appError = ErrorFactory.from(err)

  if (ErrorFactory.shouldLog(err)) {
    Logger.error('Unhandled application error', err)
  }

  return res.status(appError.statusCode).json(appError.toResponse())
}

export default errorMiddleware
