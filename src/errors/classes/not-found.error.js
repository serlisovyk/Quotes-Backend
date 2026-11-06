import { ERROR_CODE, HTTP_STATUS } from '#constants'
import AppError from '#errors/classes/app'

export default class NotFoundError extends AppError {
  constructor(message) {
    super({
      statusCode: HTTP_STATUS.NOT_FOUND,
      code: ERROR_CODE.NOT_FOUND,
      message,
    })
  }
}
