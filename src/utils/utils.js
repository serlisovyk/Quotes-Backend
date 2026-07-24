export const asyncErrorHandler = (fn) => async (req, res, next) => {
  try {
    await fn(req, res, next)
  } catch (err) {
    next(err)
  }
}

export function validateAndSplitCategories(categoriesStr) {
  const categories = categoriesStr.split(', ')
  // if any category contains space or has upper case letter it is considered invalid and we don't process such row
  return categories.some(
    (category) => category.includes(' ') || /[A-Z]/.test(category),
  )
    ? []
    : categories
}

export function pauseStream(stream, time) {
  stream.pause()
  setTimeout(() => {
    stream.resume()
  }, time)
}
