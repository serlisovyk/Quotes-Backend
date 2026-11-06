import { Router } from 'express'
import * as QuotesController from '#controllers/quotes'
import * as QuotesValidator from '#validators/quote'
import asyncHandler from '#middlewares/async-handler'
import validationErrorHandler from '#middlewares/validation-error'
import { writeRateLimiter } from '#middlewares/rate-limit'
import { ROUTER_PATH } from '#constants'

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
  writeRateLimiter,
  QuotesValidator.postQuoteValidators,
  validationErrorHandler,
  asyncHandler(QuotesController.postQuote),
)

router.patch(
  ROUTER_PATH.ID,
  writeRateLimiter,
  QuotesValidator.patchSingleQuoteValidators,
  validationErrorHandler,
  asyncHandler(QuotesController.patchQuoteById),
)

router.delete(
  ROUTER_PATH.ID,
  writeRateLimiter,
  QuotesValidator.deleteSingleQuoteValidators,
  validationErrorHandler,
  asyncHandler(QuotesController.deleteQuoteById),
)

export default router
