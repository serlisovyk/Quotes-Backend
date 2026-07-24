import * as QuotesService from '../services/quotesService.js'
import {
  DEFAULT_OFFSET,
  DEFAULT_QUOTES_LIMIT,
  ERROR_MESSAGE,
  RANDOM_QUOTES_LIMIT,
} from '../constants/constants.js'
import NotFoundError from '../errors/NotFoundError.js'

export const getQuotes = async (req, res) => {
  const {
    text,
    author,
    category,
    limit = DEFAULT_QUOTES_LIMIT,
    offset = DEFAULT_OFFSET,
  } = req.query

  const quotes = await QuotesService.findQuotes({
    limit,
    offset,
    author,
    text,
    category,
  })

  res.json(quotes)
}

export const getRandomQuotes = async (req, res) => {
  const { limit = RANDOM_QUOTES_LIMIT } = req.query

  const quotes = await QuotesService.findRandomQuotes(limit)

  res.json(quotes)
}

export const getQuoteById = async (req, res) => {
  const quoteId = req.params.id

  const quote = await QuotesService.findSingleQuote(quoteId)

  if (!quote) throw new NotFoundError(ERROR_MESSAGE.QUOTE_NOT_FOUND(quoteId))

  res.json(quote)
}

export const deleteQuoteById = async (req, res) => {
  const quoteId = req.params.id

  const deletedQuoteId = await QuotesService.deleteSingleQuote(quoteId)

  if (!deletedQuoteId) {
    throw new NotFoundError(ERROR_MESSAGE.QUOTE_NOT_FOUND(quoteId))
  }

  res.status(204).send()
}

export const patchQuoteById = async (req, res) => {
  const quoteId = req.params.id

  const { text, author, categories } = req.body

  const updateData = { text, author, categories }

  const modifiedQuote = await QuotesService.modifySingleQuote(quoteId, updateData)

  if (!modifiedQuote) {
    throw new NotFoundError(ERROR_MESSAGE.QUOTE_NOT_FOUND(quoteId))
  }

  res.json(modifiedQuote)
}

export const postQuote = async (req, res) => {
  const { text, author, categories } = req.body

  const quote = await QuotesService.createQuote({ text, author, categories })

  res.status(200).json(quote)
}
