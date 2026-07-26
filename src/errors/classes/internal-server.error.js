import { ERROR_CODE } from '#constants/errors.constant'
import { HTTP_STATUS } from '#constants/app.constant'
import AppError from '#errors/classes/app'

export default class InternalServerError extends AppError {
  constructor(message) {
    super({
      statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
      code: ERROR_CODE.INTERNAL_SERVER_ERROR,
      message,
    })
  }
}
