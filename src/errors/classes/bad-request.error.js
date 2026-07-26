import { ERROR_CODE } from '../../constants/errors.constant.js'
import { HTTP_STATUS } from '../../constants/app.constant.js'
import AppError from './app/index.js'

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
