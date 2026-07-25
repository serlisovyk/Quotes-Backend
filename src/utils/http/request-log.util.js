import Logger from '../../logger/logger.service.js'
import { HTTP_STATUS } from '../../constants/app.constant.js'

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
