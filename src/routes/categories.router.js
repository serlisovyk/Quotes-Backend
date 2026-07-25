import { Router } from 'express'
import * as CategoriesController from '../controllers/categories.controller.js'
import * as CategoriesValidator from '../validators/category.validator.js'
import asyncHandler from '../middlewares/async-handler.middleware.js'
import validationErrorHandler from '../middlewares/validation-error.middleware.js'
import { ROUTER_PATH } from '../constants/app.constant.js'

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
