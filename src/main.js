import app from './app.js'
import dbInit from './database/dbInit.js'
import Logger from './logger/logger.js'
import { startServer } from './server.js'

async function bootstrap() {
  try {
    await dbInit()
    startServer(app)
  } catch (error) {
    Logger.error('Unable to initialize application', error)
    process.exit(1)
  }
}

void bootstrap()
