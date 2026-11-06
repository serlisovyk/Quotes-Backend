import { NotFoundError } from '#errors/classes'
import * as CategoriesService from '#services/categories'
import { sendOk } from '#utils/http/response'
import { ERROR_MESSAGE, DEFAULT_CATEGORIES_LIMIT, DEFAULT_OFFSET } from '#constants'

export async function getCategories(req, res) {
  const {
    limit = DEFAULT_CATEGORIES_LIMIT,
    offset = DEFAULT_OFFSET,
    name,
  } = req.query

  const categoriesPage = await CategoriesService.findCategories({
    limit,
    offset,
    name,
  })

  sendOk(res, categoriesPage)
}

export async function getCategoryById(req, res) {
  const categoryId = req.params.id

  const category = await CategoriesService.findSingleCategory(categoryId)

  if (!category) {
    throw new NotFoundError(ERROR_MESSAGE.CATEGORY_NOT_FOUND(categoryId))
  }

  sendOk(res, category)
}
