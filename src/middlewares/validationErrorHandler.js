import { validationResult } from 'express-validator'
import { ERROR_MESSAGE } from '../constants/constants.js'
import ValidationError from '../errors/ValidationError.js'
import formatValidationErrors from '../utils/formatValidationErrors.js'

const validationErrorHandler = (req, res, next) => {
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
