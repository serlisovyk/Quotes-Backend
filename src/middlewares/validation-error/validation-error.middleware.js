import { validationResult } from 'express-validator'
import { ValidationError } from '#errors/classes'
import formatValidationErrors from '#utils/validation/format-validation-errors'
import { ERROR_MESSAGE } from '#constants'

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
