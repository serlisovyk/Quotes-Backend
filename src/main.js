import syncDatabase from '#utils/database/sync-database'
import resetIdSequences from '#utils/database/reset-id-sequences'
import Logger from '#logger'
import app from './app.js'
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
