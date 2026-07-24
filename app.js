import app from './src/server.js'
import dbInit from './src/database/dbInit.js'
import { APP_PORT } from './src/config/config.js'

const startServer = async () => {
  try {
    await dbInit()
    app.listen(APP_PORT, () => console.log(`Server is running on port ${APP_PORT}`))
  } catch (error) {
    console.error('Unable to sync database:', error)
    process.exit(1)
  }
}

startServer()
