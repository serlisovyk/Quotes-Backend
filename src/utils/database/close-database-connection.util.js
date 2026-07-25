import sequelize from '../../database/db.js'
import Logger from '../../logger/logger.service.js'

export default async function closeDatabaseConnection() {
  await sequelize.close()
  Logger.success('Database connection closed')
}
