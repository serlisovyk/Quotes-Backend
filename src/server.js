import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import quotesRouter from './routes/quotesRouter.js'
import categoriesRouter from './routes/categoriesRouter.js'
import healthRouter from './routes/healthRouter.js'
import errorMiddleware from './middlewares/errorMiddleware.js'

const app = express()

app.use(helmet())
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 })) // 100 queries / 15 min.
app.use(cors())
app.use(express.json())

app.use('/health', healthRouter)
app.use('/quotes', quotesRouter)
app.use('/categories', categoriesRouter)

app.use(errorMiddleware)

export default app
