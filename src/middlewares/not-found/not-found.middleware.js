import { NotFoundError } from '#errors/classes'
import { ERROR_MESSAGE } from '#constants'

function notFoundMiddleware(req, _, next) {
  next(new NotFoundError(ERROR_MESSAGE.ROUTE_NOT_FOUND(req.method, req.originalUrl)))
}

export default notFoundMiddleware
