import {
  buildRequestLogMessage,
  logRequest,
} from '../utils/http/request-log.util.js'

function requestLoggerMiddleware(req, res, next) {
  const startedAt = Date.now()

  res.on('finish', () => {
    const durationMs = Date.now() - startedAt
    const message = buildRequestLogMessage(req, res, durationMs)

    logRequest(message, res.statusCode)
  })

  next()
}

export default requestLoggerMiddleware
