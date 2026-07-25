import fs from 'fs'
import path from 'path'
import csv from 'csv-parser'
import { fileURLToPath } from 'url'
import sequelize from '../../db.js'
import '../../models/associations.js'
import {
  CSV_IMPORT_BATCH_SIZE,
  CSV_IMPORT_BATCH_TIMEOUT,
} from '../../../config/app.config.js'
import Logger from '../../../logger/logger.service.js'
import importQuoteRow from '../../../utils/seed/import-quote-row.util.js'
import pauseStream from '../../../utils/seed/pause-stream.util.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const CSV_FILENAME = path.resolve(__dirname, '../data/test-quotes.csv')

async function importQuotes() {
  try {
    await sequelize.sync({ force: true })

    let rowIndex = 0

    const stream = fs.createReadStream(CSV_FILENAME).pipe(csv())

    for await (const row of stream) {
      rowIndex += 1

      if (rowIndex % CSV_IMPORT_BATCH_SIZE === 0) {
        Logger.info(`Paused after ${rowIndex} rows`)
        await pauseStream(stream, CSV_IMPORT_BATCH_TIMEOUT)
      }

      await importQuoteRow(row)
    }

    Logger.success('Processing of the CSV quotes file finished')
  } catch (error) {
    Logger.error('Error importing quotes', error)
  }
}

importQuotes()
