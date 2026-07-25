import { Router } from 'express'
import * as QuotesController from '../controllers/quotes.controller.js'
import * as QuotesValidator from '../validators/quote.validator.js'
import asyncHandler from '../middlewares/async-handler.middleware.js'
import validationErrorHandler from '../middlewares/validation-error.middleware.js'
import { ROUTER_PATH } from '../constants/app.constant.js'

const router = Router()

router.get(
  ROUTER_PATH.ROOT,
  QuotesValidator.getQuotesValidators,
  validationErrorHandler,
  asyncHandler(QuotesController.getQuotes),
)

router.get(
  ROUTER_PATH.RANDOM,
  QuotesValidator.getRandomQuotesValidators,
  validationErrorHandler,
  asyncHandler(QuotesController.getRandomQuotes),
)

router.get(
  ROUTER_PATH.ID,
  QuotesValidator.getSingleQuoteValidators,
  validationErrorHandler,
  asyncHandler(QuotesController.getQuoteById),
)

router.post(
  ROUTER_PATH.ROOT,
  QuotesValidator.postQuoteValidators,
  validationErrorHandler,
  asyncHandler(QuotesController.postQuote),
)

router.patch(
  ROUTER_PATH.ID,
  QuotesValidator.patchSingleQuoteValidators,
  validationErrorHandler,
  asyncHandler(QuotesController.patchQuoteById),
)

router.delete(
  ROUTER_PATH.ID,
  QuotesValidator.deleteSingleQuoteValidators,
  validationErrorHandler,
  asyncHandler(QuotesController.deleteQuoteById),
)

export default router
