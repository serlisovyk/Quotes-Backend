import { ERROR_MESSAGE } from '../constants/errors.js'
import NotFoundError from '../errors/classes/NotFoundError.js'

const notFoundMiddleware = (req, _, next) => {
  next(new NotFoundError(ERROR_MESSAGE.ROUTE_NOT_FOUND(req.method, req.originalUrl)))
}

export default notFoundMiddleware
