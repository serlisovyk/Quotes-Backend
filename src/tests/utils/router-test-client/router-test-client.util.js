import express from 'express'
import request from 'supertest'
import errorMiddleware from '#middlewares/error'

export function createRouterTestClient({
  route,
  router,
  useErrorMiddleware = true,
  useJsonParser = true,
}) {
  const app = express()

  if (useJsonParser) {
    app.use(express.json())
  }

  app.use(route, router)

  if (useErrorMiddleware) {
    app.use(errorMiddleware)
  }

  return request(app)
}

export function createRouterTestClientFactory(options) {
  return function requestRouter() {
    return createRouterTestClient(options)
  }
}
