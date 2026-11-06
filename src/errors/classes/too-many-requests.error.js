import AppError from '#errors/classes/app'
import { ERROR_CODE, HTTP_STATUS } from '#constants'

export default class TooManyRequestsError extends AppError {
  constructor(message) {
    super({
      statusCode: HTTP_STATUS.TOO_MANY_REQUESTS,
      code: ERROR_CODE.TOO_MANY_REQUESTS,
      message,
    })
  }
}
