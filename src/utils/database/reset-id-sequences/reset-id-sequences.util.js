import { Category, Quote } from '#models'
import Logger from '#logger'
import resetSequence from '#utils/database/reset-sequence'

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
