import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import quotesRouter from './routes/quotes.router.js'
import categoriesRouter from './routes/categories.router.js'
import healthRouter from './routes/health.router.js'
import errorMiddleware from './middlewares/error.middleware.js'
import notFoundMiddleware from './middlewares/not-found.middleware.js'
import requestLoggerMiddleware from './middlewares/request-logger.middleware.js'
import {
  MINUTES_IN_MS,
  RATE_LIMIT_MAX_REQUESTS,
  ROUTE,
} from './constants/app.constant.js'

const app = express()

app.use(helmet())
app.use(rateLimit({ windowMs: MINUTES_IN_MS.FIFTEEN, max: RATE_LIMIT_MAX_REQUESTS }))
app.use(cors())

app.use(express.json())

app.use(requestLoggerMiddleware)

app.use(ROUTE.HEALTH, healthRouter)
app.use(ROUTE.QUOTES, quotesRouter)
app.use(ROUTE.CATEGORIES, categoriesRouter)

app.use(notFoundMiddleware)
app.use(errorMiddleware)

export default app
