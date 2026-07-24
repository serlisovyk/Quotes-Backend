import sequelize from './db.js'
import { resetIdSequences } from './utils/sequenceUtils.js'
import Logger from '../logger/logger.js'
import './models/associations.js'

const syncDatabase = async () => {
  try {
    await sequelize.sync()
    Logger.success('Database synchronized')
  } catch (error) {
    Logger.error('Unable to sync database', error)
    throw error
  }
}

const dbInit = async () => {
  await syncDatabase()
  await resetIdSequences()
}

export default dbInit
