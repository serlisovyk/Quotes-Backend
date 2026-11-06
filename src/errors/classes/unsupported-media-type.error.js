import AppError from '#errors/classes/app'
import { ERROR_CODE, HTTP_STATUS } from '#constants'

export default class UnsupportedMediaTypeError extends AppError {
  constructor(message) {
    super({
      statusCode: HTTP_STATUS.UNSUPPORTED_MEDIA_TYPE,
      code: ERROR_CODE.UNSUPPORTED_MEDIA_TYPE,
      message,
    })
  }
}
