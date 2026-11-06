export default function removeDuplicateCategories(categories) {
  if (!Array.isArray(categories)) return categories

  return [...new Set(categories)]
}
