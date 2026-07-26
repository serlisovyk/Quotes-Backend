import { Router } from 'express'
import * as CategoriesController from '../../controllers/categories/index.js'
import * as CategoriesValidator from '../../validators/category/index.js'
import asyncHandler from '../../middlewares/async-handler/index.js'
import validationErrorHandler from '../../middlewares/validation-error/index.js'
import { ROUTER_PATH } from '../../constants/app.constant.js'

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
