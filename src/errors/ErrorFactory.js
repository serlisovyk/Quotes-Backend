import { ERROR_MESSAGE } from '../constants/constants.js'
import AppError from './AppError.js'
import InternalServerError from './InternalServerError.js'
import InvalidJsonError from './InvalidJsonError.js'

export default class ErrorFactory {
  static from(error) {
    if (this.isInvalidJsonError(error)) {
      return new InvalidJsonError(ERROR_MESSAGE.INVALID_JSON)
    }

    if (error instanceof AppError) {
      return error
    }

    return new InternalServerError(ERROR_MESSAGE.INTERNAL_SERVER_ERROR)
  }

  static shouldLog(error) {
    return !(error instanceof AppError) && !this.isInvalidJsonError(error)
  }

  static isInvalidJsonError(error) {
    return error instanceof SyntaxError && error.status === 400 && 'body' in error
  }
}
