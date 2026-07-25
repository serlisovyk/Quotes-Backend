import { ERROR_CODE } from '../../constants/errors.constant.js'
import AppError from './app.error.js'

export default class InternalServerError extends AppError {
  constructor(message) {
    super({
      statusCode: 500,
      code: ERROR_CODE.INTERNAL_SERVER_ERROR,
      message,
    })
  }
}
