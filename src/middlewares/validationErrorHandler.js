import { validationResult } from 'express-validator'
import { ERROR_MESSAGE } from '../constants/errors.js'
import ValidationError from '../errors/classes/ValidationError.js'
import formatValidationErrors from '../utils/validation/formatValidationErrors.js'

const validationErrorHandler = (req, _, next) => {
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    return next(
      new ValidationError(
        ERROR_MESSAGE.INVALID_REQUEST_DATA,
        formatValidationErrors(errors),
      ),
    )
  }

  next()
}

export default validationErrorHandler
