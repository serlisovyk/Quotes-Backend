import sequelize from '#database'
import Logger from '#logger'

export default async function closeDatabaseConnection() {
  await sequelize.close()
  Logger.success('Database connection closed')
}
