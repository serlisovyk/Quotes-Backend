import fs from 'fs'
import path from 'path'
import csv from 'csv-parser'
import sequelize from '#database'
import { Quote } from '#models'
import Logger from '#logger'
import { findOrCreateCategories } from '#services/categories'
import closeDatabaseConnection from '#utils/database/close-database-connection'
import parseQuoteRow from '#utils/seed/parse-quote-row'
import pauseStream from '#utils/seed/pause-stream'
import {
  ALLOW_SEED_RESET,
  CSV_IMPORT_BATCH_SIZE,
  CSV_IMPORT_BATCH_TIMEOUT,
} from '#config'

const CSV_FILENAME = path.resolve(import.meta.dirname, '../data/test-quotes.csv')

async function importQuotes() {
  try {
    if (!ALLOW_SEED_RESET) {
      Logger.warn(
        'Skipping quotes import: ALLOW_SEED_RESET must be true because this script resets database tables',
      )

      process.exitCode = 1
      return
    }

    await sequelize.sync({ force: true })

    let rowIndex = 0

    const stream = fs.createReadStream(CSV_FILENAME).pipe(csv())

    for await (const row of stream) {
      rowIndex += 1

      if (rowIndex % CSV_IMPORT_BATCH_SIZE === 0) {
        Logger.info(`Paused after ${rowIndex} rows`)
        await pauseStream(stream, CSV_IMPORT_BATCH_TIMEOUT)
      }

      const parsedRow = parseQuoteRow(row)

      if (!parsedRow) continue

      const { categories, ...quoteFields } = parsedRow

      const quote = await Quote.create(quoteFields)
      const categoryInstances = await findOrCreateCategories(categories)

      await quote.addCategories(categoryInstances)
    }

    Logger.success('Processing of the CSV quotes file finished')
  } catch (error) {
    Logger.error('Error importing quotes', error)
    process.exitCode = 1
  } finally {
    await closeDatabaseConnection()
  }
}

importQuotes()
