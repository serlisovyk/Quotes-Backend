import { Router } from 'express'
import * as CategoriesController from '#controllers/categories'
import * as CategoriesValidator from '#validators/category'
import cacheControl from '#middlewares/cache-control'
import asyncHandler from '#middlewares/async-handler'
import validationErrorHandler from '#middlewares/validation-error'
import { CACHE_CONTROL, ROUTER_PATH } from '#constants'

const router = Router()

router.get(
  ROUTER_PATH.ROOT,
  cacheControl(CACHE_CONTROL.PUBLIC_SHORT),
  CategoriesValidator.getCategoriesValidators,
  validationErrorHandler,
  asyncHandler(CategoriesController.getCategories),
)

router.get(
  ROUTER_PATH.ID,
  cacheControl(CACHE_CONTROL.PUBLIC_SHORT),
  CategoriesValidator.getSingleCategoryValidators,
  validationErrorHandler,
  asyncHandler(CategoriesController.getCategoryById),
)

export default router
