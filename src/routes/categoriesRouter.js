import { Router } from 'express'
import * as CategoriesController from '../controllers/categoriesController.js'
import * as CategoriesValidator from '../validators/categoryValidators.js'
import asyncErrorHandler from '../middlewares/asyncErrorHandler.js'
import validationErrorHandler from '../middlewares/validationErrorHandler.js'

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
