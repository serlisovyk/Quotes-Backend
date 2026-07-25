import app from './app.js'
import resetIdSequences from './utils/database/resetIdSequences.js'
import syncDatabase from './utils/database/syncDatabase.js'
import Logger from './logger/logger.js'
import { startServer } from './server.js'

async function bootstrap() {
  try {
    await syncDatabase()
    await resetIdSequences()
    startServer(app)
  } catch (error) {
    Logger.error('Unable to initialize application', error)
    process.exit(1)
  }
}

void bootstrap()
