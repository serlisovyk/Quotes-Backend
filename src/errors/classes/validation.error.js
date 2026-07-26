import { ERROR_CODE } from '#constants/errors.constant'
import BadRequestError from './bad-request.error.js'

export default class ValidationError extends BadRequestError {
  constructor(message, fields) {
    super(message, fields, ERROR_CODE.VALIDATION_ERROR)
  }
}
