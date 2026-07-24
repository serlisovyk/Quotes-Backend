import { Router } from 'express'
import * as QuotesController from '../controllers/quotesController.js'
import * as QuotesValidator from '../validators/quoteValidators.js'
import asyncErrorHandler from '../middlewares/asyncErrorHandler.js'
import validationErrorHandler from '../middlewares/validationErrorHandler.js'

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
