import sequelize from '../db.js'
import Category from '../models/Category.js'
import Quote from '../models/Quote.js'
import Logger from '../../logger/logger.js'

const resetSequence = async (model, sequenceName) => {
  const maxId = Number(await model.max('id'))

  if (!maxId) {
    Logger.info(`Skipping sequence reset for ${model.tableName}: table is empty`)
    return
  }

  await sequelize.query(`SELECT setval('"${sequenceName}"', ${maxId});`)
}

export const resetIdSequences = async () => {
  try {
    await resetSequence(Quote, 'Quotes_id_seq')
    await resetSequence(Category, 'Categories_id_seq')

    Logger.success('Quotes and Categories ID Sequences reset')
  } catch (error) {
    Logger.error('Unable to reset ID sequences', error)
    throw error
  }
}
