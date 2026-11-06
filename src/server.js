import Logger from '#logger'
import registerGracefulShutdown from '#utils/server/graceful-shutdown'
import { APP_PORT } from '#config'

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
