import { ERROR_CODE } from '../constants/constants.js'
import AppError from './AppError.js'

export default class BadRequestError extends AppError {
  constructor(message, fields, code = ERROR_CODE.BAD_REQUEST) {
    super({
      statusCode: 400,
      code,
      message,
      fields,
    })
  }
}
