import Logger from '#logger'
import { HTTP_STATUS, SKIPPED_REQUEST_LOG_ROUTES } from '#constants'

export function shouldSkipRequestLog(req) {
  return SKIPPED_REQUEST_LOG_ROUTES.includes(req.path)
}

export function buildRequestLogMessage(req, res, durationMs) {
  return `${req.method} ${req.originalUrl} ${res.statusCode} ${durationMs}ms`
}

export function logRequest(message, statusCode) {
  if (statusCode >= HTTP_STATUS.INTERNAL_SERVER_ERROR) {
    Logger.error(message)
    return
  }

  if (statusCode >= HTTP_STATUS.BAD_REQUEST) {
    Logger.warn(message)
    return
  }

  Logger.success(message)
}
