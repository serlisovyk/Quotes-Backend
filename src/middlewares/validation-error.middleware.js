import { validationResult } from 'express-validator'
import { ERROR_MESSAGE } from '../constants/errors.constant.js'
import ValidationError from '../errors/classes/validation.error.js'
import formatValidationErrors from '../utils/validation/format-validation-errors.util.js'

function validationErrorHandler(req, _, next) {
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
