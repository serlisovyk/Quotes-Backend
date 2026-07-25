import { ERROR_CODE } from '../../constants/errors.constant.js'
import { HTTP_STATUS } from '../../constants/app.constant.js'
import AppError from './app.error.js'

export default class NotFoundError extends AppError {
  constructor(message) {
    super({
      statusCode: HTTP_STATUS.NOT_FOUND,
      code: ERROR_CODE.NOT_FOUND,
      message,
    })
  }
}
