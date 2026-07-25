function asyncErrorHandler(handler) {
  return async function handleAsyncError(req, res, next) {
    try {
      await handler(req, res, next)
    } catch (error) {
      next(error)
    }
  }
}

export default asyncErrorHandler
