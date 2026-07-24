import { ERROR_CODE } from '../constants/constants.js'
import BadRequestError from './BadRequestError.js'

export default class InvalidJsonError extends BadRequestError {
  constructor(message) {
    super(message, undefined, ERROR_CODE.INVALID_JSON)
  }
}
