import NotFoundError from '../../errors/classes/not-found.error.js'
import { ERROR_MESSAGE } from '#constants/errors.constant'

function notFoundMiddleware(req, _, next) {
  next(new NotFoundError(ERROR_MESSAGE.ROUTE_NOT_FOUND(req.method, req.originalUrl)))
}

export default notFoundMiddleware
