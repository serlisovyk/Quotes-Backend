import { ERROR_CODE } from '../../constants/errors.js'
import BadRequestError from './BadRequestError.js'

export default class ValidationError extends BadRequestError {
  constructor(message, fields) {
    super(message, fields, ERROR_CODE.VALIDATION_ERROR)
  }
}
