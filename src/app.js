import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import quotesRouter from './routes/quotesRouter.js'
import categoriesRouter from './routes/categoriesRouter.js'
import healthRouter from './routes/healthRouter.js'
import errorMiddleware from './middlewares/errorMiddleware.js'
import notFoundMiddleware from './middlewares/notFoundMiddleware.js'
import { MINUTES_IN_MS, RATE_LIMIT_MAX_REQUESTS } from './constants/app.js'

const app = express()

app.use(helmet())
app.use(rateLimit({ windowMs: MINUTES_IN_MS.FIFTEEN, max: RATE_LIMIT_MAX_REQUESTS }))
app.use(cors())
app.use(express.json())

app.use('/health', healthRouter)
app.use('/quotes', quotesRouter)
app.use('/categories', categoriesRouter)

app.use(notFoundMiddleware)
app.use(errorMiddleware)

export default app
