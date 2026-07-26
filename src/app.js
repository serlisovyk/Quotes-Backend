import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import quotesRouter from './routes/quotes/index.js'
import categoriesRouter from './routes/categories/index.js'
import healthRouter from './routes/health/index.js'
import errorMiddleware from './middlewares/error/index.js'
import notFoundMiddleware from './middlewares/not-found/index.js'
import requestLoggerMiddleware from './middlewares/request-logger/index.js'
import {
  JSON_BODY_LIMIT,
  MINUTES_IN_MS,
  RATE_LIMIT_MAX_REQUESTS,
  ROUTE,
} from './constants/app.constant.js'

const app = express()

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
