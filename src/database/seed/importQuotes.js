import fs from 'fs'
import path from 'path'
import csv from 'csv-parser'
import { fileURLToPath } from 'url'
import Quote from '../../models/Quote.js'
import Category from '../../models/Category.js'
import sequelize from '../db.js'
import {
  CSV_IMPORT_BATCH_SIZE,
  CSV_IMPORT_BATCH_TIMEOUT,
} from '../../config/config.js'
import { validateAndSplitCategories, pauseStream } from '../../utils/utils.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const CSV_FILENAME = path.resolve(__dirname, '../data/test-quotes.csv')

async function importQuotes() {
  try {
    // Synchronize models with the database
    // Set force: true to drop existing tables and re-create them
    await sequelize.sync({ force: true })

    let rowIndex = 0

    const stream = fs
      .createReadStream(CSV_FILENAME)
      .pipe(csv())
      .on('data', async (row) => {
        // 0. Batch processing. Pause stream after specific amount of rows
        rowIndex += 1

        if (rowIndex % CSV_IMPORT_BATCH_SIZE === 0) {
          console.log('Paused', rowIndex)
          pauseStream(stream, CSV_IMPORT_BATCH_TIMEOUT)
        }

        // 1. Validate row. If not valid -> End
        const categories = validateAndSplitCategories(row.category)
        if (!categories.length) return

        // 2. If row valid -> add quote to the Quotes table
        const quote = await Quote.create({
          text: row.quote,
          author: row.author.split(',')[0].slice(0, 255),
        })

        // 3. Add categories of the quote to the Categories table IF absent
        for (let category of categories) {
          await Category.findOrCreate({ where: { name: category } })
        }

        // 4. Find all categories of the quote in the Categories table
        const categoryInstances = await Category.findAll({
          where: { name: categories },
        })

        // 5. Map quote to the found quote categories
        await quote.addCategories(categoryInstances)
      })
      .on('end', () => console.log('Processing of the CSV quotes file finished'))
      .on('error', (error) => console.error('Error during CSV file parsing', error))
  } catch (error) {
    console.error('Error importing quotes:', error)
  }
}

importQuotes()
