import { NotFoundError } from '#errors/classes'
import { ERROR_MESSAGE } from '#constants'

function notFoundMiddleware(req, _, next) {
  const message = ERROR_MESSAGE.ROUTE_NOT_FOUND(req.method, req.originalUrl)

  next(new NotFoundError(message))
}

export default notFoundMiddleware
