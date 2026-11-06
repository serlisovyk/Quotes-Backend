import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import quotesRouter from '#routes/quotes'
import categoriesRouter from '#routes/categories'
import healthRouter from '#routes/health'
import rootRouter from '#routes/root'
import errorMiddleware from '#middlewares/error'
import notFoundMiddleware from '#middlewares/not-found'
import requestLoggerMiddleware from '#middlewares/request-logger'
import { generalRateLimiter } from '#middlewares/rate-limit'
import '#models'
import { JSON_BODY_LIMIT, ROUTE, TRUST_PROXY_HOPS } from '#constants'

const app = express()

app.set('trust proxy', TRUST_PROXY_HOPS)

app.use(helmet())
app.use(cors())

app.use(express.json({ limit: JSON_BODY_LIMIT }))

app.use(requestLoggerMiddleware)

app.use(ROUTE.ROOT, rootRouter)
app.use(ROUTE.HEALTH, healthRouter)

app.use(generalRateLimiter)

app.use(ROUTE.QUOTES, quotesRouter)
app.use(ROUTE.CATEGORIES, categoriesRouter)

app.use(notFoundMiddleware)
app.use(errorMiddleware)

export default app
