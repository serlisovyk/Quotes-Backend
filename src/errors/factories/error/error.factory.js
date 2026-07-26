import { ERROR_MESSAGE } from '#constants/errors.constant'
import AppError from '#errors/classes/app'
import InternalServerError from '#error-classes/internal-server'
import InvalidJsonError from '#error-classes/invalid-json'

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
