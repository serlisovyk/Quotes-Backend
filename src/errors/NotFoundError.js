import { ERROR_CODE } from '../constants/constants.js'
import AppError from './AppError.js'

export default class NotFoundError extends AppError {
  constructor(message) {
    super({
      statusCode: 404,
      code: ERROR_CODE.NOT_FOUND,
      message,
    })
  }
}
