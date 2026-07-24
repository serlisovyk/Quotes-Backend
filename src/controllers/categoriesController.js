import * as CategoriesService from '../services/categoriesService.js'

export const getCategories = async (req, res) => {
  const { limit = 10, offset = 0, name } = req.query
  const categories = await CategoriesService.findCategories({ limit, offset, name })
  res.json(categories)
}

export const getCategoryById = async (req, res) => {
  const categoryId = req.params.id
  const category = await CategoriesService.findSingleCategory(categoryId)
  if (category) {
    res.json(category)
  } else {
    const error = { message: `Category with ID ${categoryId} not found` }
    res.status(404).json(error)
  }
}
