import AppError from '#errors/classes/app'
import { ERROR_CODE, HTTP_STATUS } from '#constants'

export default class InternalServerError extends AppError {
  constructor(message) {
    super({
      statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
      code: ERROR_CODE.INTERNAL_SERVER_ERROR,
      message,
    })
  }
}
