import { ERROR_CODE } from '../../constants/errors.constant.js'
import BadRequestError from './bad-request.error.js'

export default class InvalidJsonError extends BadRequestError {
  constructor(message) {
    super(message, undefined, ERROR_CODE.INVALID_JSON)
  }
}
