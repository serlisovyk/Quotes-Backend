import sequelize from '../../database/db.js'
import '../../database/models/associations.js'
import Logger from '../../logger/logger.js'

export default async function syncDatabase() {
  try {
    await sequelize.sync()
    Logger.success('Database synchronized')
  } catch (error) {
    Logger.error('Unable to sync database', error)
    throw error
  }
}
