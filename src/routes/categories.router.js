import { Router } from 'express'
import * as CategoriesController from '../controllers/categories.controller.js'
import * as CategoriesValidator from '../validators/category.validator.js'
import asyncErrorHandler from '../middlewares/async-error.middleware.js'
import validationErrorHandler from '../middlewares/validation-error.middleware.js'

const router = Router()

router.get(
  '/',
  CategoriesValidator.getCategoriesValidators,
  validationErrorHandler,
  asyncErrorHandler(CategoriesController.getCategories),
)

router.get(
  '/:id',
  CategoriesValidator.getSingleCategoryValidators,
  validationErrorHandler,
  asyncErrorHandler(CategoriesController.getCategoryById),
)

export default router
