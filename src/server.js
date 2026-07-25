import { APP_PORT } from './config/app.config.js'
import Logger from './logger/logger.service.js'
import registerGracefulShutdown from './utils/server/graceful-shutdown.util.js'

export function startServer(app) {
  const server = app.listen(APP_PORT, () =>
    Logger.success(`Server is running on port ${APP_PORT}`),
  )

  server.on('error', (error) => {
    Logger.error('Unable to start server', error)
    process.exit(1)
  })

  registerGracefulShutdown(server)

  return server
}
