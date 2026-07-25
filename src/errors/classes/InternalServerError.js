import { ERROR_CODE } from '../../constants/errors.js'
import AppError from './AppError.js'

export default class InternalServerError extends AppError {
  constructor(message) {
    super({
      statusCode: 500,
      code: ERROR_CODE.INTERNAL_SERVER_ERROR,
      message,
    })
  }
}
