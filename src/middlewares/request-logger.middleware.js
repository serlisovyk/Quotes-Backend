import {
  buildRequestLogMessage,
  logRequest,
  shouldSkipRequestLog,
} from '../utils/http/request-log.util.js'

function requestLoggerMiddleware(req, res, next) {
  if (shouldSkipRequestLog(req)) {
    return next()
  }

  const startedAt = Date.now()

  res.on('finish', () => {
    const durationMs = Date.now() - startedAt
    const message = buildRequestLogMessage(req, res, durationMs)

    logRequest(message, res.statusCode)
  })

  next()
}

export default requestLoggerMiddleware
