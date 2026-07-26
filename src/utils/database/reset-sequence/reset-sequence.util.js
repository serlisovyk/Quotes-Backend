import sequelize from '#database'
import Logger from '#logger'

export default async function resetSequence(model, sequenceName) {
  const maxId = Number(await model.max('id'))

  if (!maxId) {
    Logger.info(`Skipping sequence reset for ${model.tableName}: table is empty`)
    return
  }

  await sequelize.query(`SELECT setval('"${sequenceName}"', ${maxId});`)
}
