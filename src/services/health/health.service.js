import sequelize from '#database'
import Logger from '#logger'

export async function isDatabaseAvailable() {
  try {
    await sequelize.authenticate()

    return true
  } catch (error) {
    Logger.warn(`Database health check failed: ${error.message}`)

    return false
  }
}
