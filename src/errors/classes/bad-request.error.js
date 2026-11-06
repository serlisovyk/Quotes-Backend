import AppError from '#errors/classes/app'
import { ERROR_CODE, HTTP_STATUS } from '#constants'

export default class BadRequestError extends AppError {
  constructor(message, fields, code = ERROR_CODE.BAD_REQUEST) {
    super({
      statusCode: HTTP_STATUS.BAD_REQUEST,
      code,
      message,
      fields,
    })
  }
}
