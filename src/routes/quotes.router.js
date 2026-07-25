import { Router } from 'express'
import * as QuotesController from '../controllers/quotes.controller.js'
import * as QuotesValidator from '../validators/quote.validator.js'
import asyncErrorHandler from '../middlewares/async-error.middleware.js'
import validationErrorHandler from '../middlewares/validation-error.middleware.js'

const router = Router()

router.get(
  '/',
  QuotesValidator.getQuotesValidators,
  validationErrorHandler,
  asyncErrorHandler(QuotesController.getQuotes),
)

router.get(
  '/random',
  QuotesValidator.getRandomQuotesValidators,
  validationErrorHandler,
  asyncErrorHandler(QuotesController.getRandomQuotes),
)

router.get(
  '/:id',
  QuotesValidator.getSingleQuoteValidators,
  validationErrorHandler,
  asyncErrorHandler(QuotesController.getQuoteById),
)

router.post(
  '/',
  QuotesValidator.postQuoteValidators,
  validationErrorHandler,
  asyncErrorHandler(QuotesController.postQuote),
)

router.patch(
  '/:id',
  QuotesValidator.patchSingleQuoteValidators,
  validationErrorHandler,
  asyncErrorHandler(QuotesController.patchQuoteById),
)

router.delete(
  '/:id',
  QuotesValidator.deleteSingleQuoteValidators,
  validationErrorHandler,
  asyncErrorHandler(QuotesController.deleteQuoteById),
)

export default router
