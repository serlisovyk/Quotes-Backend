import AppError from '#errors/classes/app'
import { ERROR_CODE, HTTP_STATUS } from '#constants'

export default class ConflictError extends AppError {
  constructor(message) {
    super({
      statusCode: HTTP_STATUS.CONFLICT,
      code: ERROR_CODE.CONFLICT,
      message,
    })
  }
}
