import { Router } from 'express'
import * as QuotesController from '../controllers/quotesController.js'
import * as QuotesValidator from '../validators/quoteValidators.js'
import validationErrorHandler from '../middlewares/validationErrorHandler.js'

const router = Router()

router.get(
  '/',
  QuotesValidator.getQuotesValidators,
  validationErrorHandler,
  QuotesController.getQuotes
)

router.get(
  '/random',
  QuotesValidator.getRandomQuotesValidators,
  validationErrorHandler,
  QuotesController.getRandomQuotes
)

router.get(
  '/:id',
  QuotesValidator.getSingleQuoteValidators,
  validationErrorHandler,
  QuotesController.getQuoteById
)

router.post(
  '/',
  QuotesValidator.postQuoteValidators,
  validationErrorHandler,
  QuotesController.postQuote
)

router.patch(
  '/:id',
  QuotesValidator.patchSingleQuoteValidators,
  validationErrorHandler,
  QuotesController.patchQuoteById
)

router.delete(
  '/:id',
  QuotesValidator.deleteSingleQuoteValidators,
  validationErrorHandler,
  QuotesController.deleteQuoteById
)

export default router
