import {
  AppError,
  InternalServerError,
  InvalidJsonError,
  PayloadTooLargeError,
  UnsupportedMediaTypeError,
} from '#errors/classes'
import { BODY_PARSER_ERROR_TYPE, ERROR_MESSAGE, HTTP_STATUS } from '#constants'

export default class ErrorFactory {
  static from(error) {
    if (this.isInvalidJsonError(error)) {
      return new InvalidJsonError(ERROR_MESSAGE.INVALID_JSON)
    }

    if (this.isPayloadTooLargeError(error)) {
      return new PayloadTooLargeError(ERROR_MESSAGE.PAYLOAD_TOO_LARGE)
    }

    if (this.isUnsupportedMediaTypeError(error)) {
      return new UnsupportedMediaTypeError(ERROR_MESSAGE.UNSUPPORTED_MEDIA_TYPE)
    }

    if (error instanceof AppError) {
      return error
    }

    return new InternalServerError(ERROR_MESSAGE.INTERNAL_SERVER_ERROR)
  }

  static shouldLog(error) {
    const isAppError = error instanceof AppError
    const isBodyParserError =
      this.isInvalidJsonError(error) ||
      this.isPayloadTooLargeError(error) ||
      this.isUnsupportedMediaTypeError(error)

    return !isAppError && !isBodyParserError
  }

  static isInvalidJsonError(error) {
    if (!(error instanceof SyntaxError)) return false

    const isBadRequest = error.status === HTTP_STATUS.BAD_REQUEST
    const hasBody = 'body' in error

    return isBadRequest && hasBody
  }

  static isPayloadTooLargeError(error) {
    return error?.type === BODY_PARSER_ERROR_TYPE.ENTITY_TOO_LARGE
  }

  static isUnsupportedMediaTypeError(error) {
    const unsupportedTypes = [
      BODY_PARSER_ERROR_TYPE.CHARSET_UNSUPPORTED,
      BODY_PARSER_ERROR_TYPE.ENCODING_UNSUPPORTED,
    ]

    return unsupportedTypes.includes(error?.type)
  }
}
