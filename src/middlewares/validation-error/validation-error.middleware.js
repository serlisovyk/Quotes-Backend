import { validationResult } from 'express-validator'
import ValidationError from '#error-classes/validation'
import formatValidationErrors from '#utils/validation/format-validation-errors'
import { ERROR_MESSAGE } from '#constants/errors.constant'

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
