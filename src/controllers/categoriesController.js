import * as CategoriesService from '../services/categoriesService.js'
import {
  DEFAULT_CATEGORIES_LIMIT,
  DEFAULT_OFFSET,
  ERROR_MESSAGE,
} from '../constants/constants.js'
import NotFoundError from '../errors/NotFoundError.js'

export const getCategories = async (req, res) => {
  const {
    limit = DEFAULT_CATEGORIES_LIMIT,
    offset = DEFAULT_OFFSET,
    name,
  } = req.query

  const categories = await CategoriesService.findCategories({ limit, offset, name })

  res.json(categories)
}

export const getCategoryById = async (req, res) => {
  const categoryId = req.params.id

  const category = await CategoriesService.findSingleCategory(categoryId)

  if (!category) {
    throw new NotFoundError(ERROR_MESSAGE.CATEGORY_NOT_FOUND(categoryId))
  }

  res.json(category)
}
