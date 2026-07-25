import Category from '../../database/models/category.model.js'
import Quote from '../../database/models/quote.model.js'
import Logger from '../../logger/logger.service.js'
import resetSequence from './reset-sequence.util.js'

export default async function resetIdSequences() {
  try {
    await resetSequence(Quote, 'Quotes_id_seq')
    await resetSequence(Category, 'Categories_id_seq')

    Logger.success('Quotes and Categories ID Sequences reset')
  } catch (error) {
    Logger.error('Unable to reset ID sequences', error)
    throw error
  }
}
