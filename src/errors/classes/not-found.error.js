import { ERROR_CODE } from '../../constants/errors.constant.js'
import AppError from './app.error.js'

export default class NotFoundError extends AppError {
  constructor(message) {
    super({
      statusCode: 404,
      code: ERROR_CODE.NOT_FOUND,
      message,
    })
  }
}
