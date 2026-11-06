import { ERROR_CODE, HTTP_STATUS } from '#constants'
import AppError from '#errors/classes/app'

export default class PayloadTooLargeError extends AppError {
  constructor(message) {
    super({
      statusCode: HTTP_STATUS.PAYLOAD_TOO_LARGE,
      code: ERROR_CODE.PAYLOAD_TOO_LARGE,
      message,
    })
  }
}
