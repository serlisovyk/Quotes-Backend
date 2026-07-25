import { CATEGORY_UPPERCASE_REGEX } from '../../constants/validation.constant.js'

export default function validateAndSplitCategories(categoriesStr) {
  if (!categoriesStr) return []

  const categories = categoriesStr
    .split(',')
    .map((category) => category.trim())
    .filter(Boolean)

  const hasInvalidCategory = categories.some(
    (category) => category.includes(' ') || CATEGORY_UPPERCASE_REGEX.test(category),
  )

  if (hasInvalidCategory) return []

  return categories
}
