import sequelize from '#database'
import Logger from '#logger'
import '#models/associations'

export default async function syncDatabase() {
  try {
    await sequelize.sync()
    Logger.success('Database synchronized')
  } catch (error) {
    Logger.error('Unable to sync database', error)
    throw error
  }
}
