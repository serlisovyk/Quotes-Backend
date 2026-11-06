import closeDatabaseConnection from '#utils/database/close-database-connection'
import Logger from '#logger'
import { SHUTDOWN_TIMEOUT_MS } from '#constants'

export default function registerGracefulShutdown(server) {
  let isShuttingDown = false
  let forceExitTimer

  function exit(code) {
    clearTimeout(forceExitTimer)
    process.exit(code)
  }

  function forceExit() {
    Logger.error(`Shutdown did not finish in ${SHUTDOWN_TIMEOUT_MS}ms. Forcing exit`)
    process.exit(1)
  }

  async function shutdown(signal) {
    if (isShuttingDown) return

    isShuttingDown = true
    Logger.info(`Received ${signal}. Closing server...`)

    forceExitTimer = setTimeout(forceExit, SHUTDOWN_TIMEOUT_MS)

    server.close(async (error) => {
      if (error) {
        Logger.error('Unable to close HTTP server', error)
        return exit(1)
      }

      try {
        await closeDatabaseConnection()
        exit(0)
      } catch (closeError) {
        Logger.error('Unable to close database connection', closeError)
        exit(1)
      }
    })
  }

  process.on('SIGINT', () => void shutdown('SIGINT'))
  process.on('SIGTERM', () => void shutdown('SIGTERM'))
}
