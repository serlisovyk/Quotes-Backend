import { Router } from 'express'
import * as CategoriesController from '#controllers/categories'
import * as CategoriesValidator from '#validators/category'
import asyncHandler from '#middlewares/async-handler'
import validationErrorHandler from '#middlewares/validation-error'
import { ROUTER_PATH } from '#constants/app.constant'

const router = Router()

router.get(
  ROUTER_PATH.ROOT,
  CategoriesValidator.getCategoriesValidators,
  validationErrorHandler,
  asyncHandler(CategoriesController.getCategories),
)

router.get(
  ROUTER_PATH.ID,
  CategoriesValidator.getSingleCategoryValidators,
  validationErrorHandler,
  asyncHandler(CategoriesController.getCategoryById),
)

export default router
