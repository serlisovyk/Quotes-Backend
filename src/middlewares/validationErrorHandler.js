import { validationResult } from 'express-validator'
import { ERROR_CODE, ERROR_MESSAGE } from '../constants/constants.js'
import formatValidationErrors from '../utils/formatValidationErrors.js'

const validationErrorHandler = (req, res, next) => {
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: {
        code: ERROR_CODE.VALIDATION_ERROR,
        message: ERROR_MESSAGE.INVALID_REQUEST_DATA,
        fields: formatValidationErrors(errors),
      },
    })
  }

  next()
}

export default validationErrorHandler
