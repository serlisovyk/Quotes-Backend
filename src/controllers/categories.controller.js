import * as CategoriesService from '../services/categories.service.js'
import NotFoundError from '../errors/classes/not-found.error.js'
import { ERROR_MESSAGE } from '../constants/errors.constant.js'
import {
  DEFAULT_CATEGORIES_LIMIT,
  DEFAULT_OFFSET,
} from '../constants/app.constant.js'
import { sendOk } from '../utils/http/response.util.js'

export async function getCategories(req, res) {
  const {
    limit = DEFAULT_CATEGORIES_LIMIT,
    offset = DEFAULT_OFFSET,
    name,
  } = req.query

  const categories = await CategoriesService.findCategories({ limit, offset, name })

  sendOk(res, categories)
}

export async function getCategoryById(req, res) {
  const categoryId = req.params.id

  const category = await CategoriesService.findSingleCategory(categoryId)

  if (!category) {
    throw new NotFoundError(ERROR_MESSAGE.CATEGORY_NOT_FOUND(categoryId))
  }

  sendOk(res, category)
}
