import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import quotesRouter from '#routes/quotes'
import categoriesRouter from '#routes/categories'
import healthRouter from '#routes/health'
import errorMiddleware from '#middlewares/error'
import notFoundMiddleware from '#middlewares/not-found'
import requestLoggerMiddleware from '#middlewares/request-logger'
import {
  JSON_BODY_LIMIT,
  MINUTES_IN_MS,
  RATE_LIMIT_MAX_REQUESTS,
  ROUTE,
  TRUST_PROXY_HOPS,
} from '#constants/app.constant'
import '#models/associations'

const app = express()

app.set('trust proxy', TRUST_PROXY_HOPS)

app.use(helmet())
app.use(cors())

app.use(express.json({ limit: JSON_BODY_LIMIT }))

app.use(requestLoggerMiddleware)

app.use(ROUTE.HEALTH, healthRouter)

app.use(rateLimit({ windowMs: MINUTES_IN_MS.FIFTEEN, max: RATE_LIMIT_MAX_REQUESTS }))

app.use(ROUTE.QUOTES, quotesRouter)
app.use(ROUTE.CATEGORIES, categoriesRouter)

app.use(notFoundMiddleware)
app.use(errorMiddleware)

export default app
