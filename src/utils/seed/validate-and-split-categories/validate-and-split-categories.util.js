import {
  CATEGORY_NAME_MAX_LENGTH,
  CATEGORY_UPPERCASE_REGEX,
  MAX_CATEGORIES_PER_QUOTE,
} from '#constants'

export default function validateAndSplitCategories(categoriesStr) {
  if (!categoriesStr) return []

  const categories = categoriesStr
    .split(',')
    .map((category) => category.trim())
    .filter(Boolean)

  const hasInvalidCategory = categories.some(
    (category) =>
      category.includes(' ') ||
      CATEGORY_UPPERCASE_REGEX.test(category) ||
      category.length > CATEGORY_NAME_MAX_LENGTH,
  )

  if (hasInvalidCategory) return []

  return categories.slice(0, MAX_CATEGORIES_PER_QUOTE)
}
