import closeDatabaseConnection from '#utils/database/close-database-connection'
import Logger from '#logger'

export default function registerGracefulShutdown(server) {
  async function shutdown(signal) {
    Logger.info(`Received ${signal}. Closing server...`)

    server.close(async (error) => {
      if (error) {
        Logger.error('Unable to close HTTP server', error)
        return process.exit(1)
      }

      try {
        await closeDatabaseConnection()
        process.exit(0)
      } catch (closeError) {
        Logger.error('Unable to close database connection', closeError)
        process.exit(1)
      }
    })
  }

  process.on('SIGINT', () => void shutdown('SIGINT'))
  process.on('SIGTERM', () => void shutdown('SIGTERM'))
}
