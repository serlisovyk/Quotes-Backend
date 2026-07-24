import sequelize from './db.js'

const syncDatabase = async () => {
  try {
    await sequelize.sync()
    console.log('Database synchronized')
  } catch (error) {
    console.error('Unable to sync database:', error)
    throw error
  }
}

const resetSequence = async (tableName, sequenceName) => {
  const [results] = await sequelize.query(`SELECT MAX(id) AS "maxId" FROM "${tableName}";`)
  const [result] = results

  if (result.maxId === null) {
    console.log(`Skipping sequence reset for ${tableName}: table is empty`)
    return
  }

  await sequelize.query(`SELECT setval('"${sequenceName}"', ${Number(result.maxId)});`)
}

const resetIdSequences = async () => {
  try {
    await resetSequence('Quotes', 'Quotes_id_seq')
    await resetSequence('Categories', 'Categories_id_seq')

    console.log('Quotes and Categories ID Sequences reset')
  } catch (error) {
    console.error('Unable to reset ID sequences:', error)
    throw error
  }
}

const dbInit = async () => {
  await syncDatabase()
  await resetIdSequences()
}

export default dbInit
