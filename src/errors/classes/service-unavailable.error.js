import AppError from '#errors/classes/app'
import { ERROR_CODE, HTTP_STATUS } from '#constants'

export default class ServiceUnavailableError extends AppError {
  constructor(message) {
    super({
      statusCode: HTTP_STATUS.SERVICE_UNAVAILABLE,
      code: ERROR_CODE.SERVICE_UNAVAILABLE,
      message,
    })
  }
}
