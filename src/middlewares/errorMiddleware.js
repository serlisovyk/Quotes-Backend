import ErrorFactory from '../errors/ErrorFactory.js'
import Logger from '../logger/logger.js'

const errorMiddleware = (err, req, res, next) => {
  const { statusCode, toResponse } = ErrorFactory.from(err)

  if (ErrorFactory.shouldLog(err)) {
    Logger.error('Unhandled application error', err)
  }

  return res.status(statusCode).json(toResponse())
}

export default errorMiddleware
