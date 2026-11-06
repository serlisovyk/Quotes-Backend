import AppError from '#errors/classes/app'
import { ERROR_CODE, HTTP_STATUS } from '#constants'

export default class NotFoundError extends AppError {
  constructor(message) {
    super({
      statusCode: HTTP_STATUS.NOT_FOUND,
      code: ERROR_CODE.NOT_FOUND,
      message,
    })
  }
}
