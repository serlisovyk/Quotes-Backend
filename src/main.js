import app from './app.js'
import resetIdSequences from './utils/database/reset-id-sequences.util.js'
import syncDatabase from './utils/database/sync-database.util.js'
import Logger from './logger/logger.service.js'
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
