import { ERROR_MESSAGE } from '../constants/constants.js'
import NotFoundError from '../errors/NotFoundError.js'

const notFoundMiddleware = (req, _, next) => {
  next(new NotFoundError(ERROR_MESSAGE.ROUTE_NOT_FOUND(req.method, req.originalUrl)))
}

export default notFoundMiddleware
