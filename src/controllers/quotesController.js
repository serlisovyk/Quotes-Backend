import * as QuotesService from '../services/quotesService.js'
import {
  DEFAULT_QUOTES_LIMIT,
  getQuoteNotFoundErrorMessage,
  RANDOM_QUOTES_LIMIT,
} from '../constants/constants.js'
import { asyncErrorHandler } from '../utils/utils.js'

export const getQuotes = asyncErrorHandler(async (req, res) => {
  const {
    text,
    author,
    category,
    limit = DEFAULT_QUOTES_LIMIT,
    offset = 0,
  } = req.query
  const quotes = await QuotesService.findQuotes({
    limit,
    offset,
    author,
    text,
    category,
  })
  res.json(quotes)
})

export const getRandomQuotes = asyncErrorHandler(async (req, res) => {
  const { limit = RANDOM_QUOTES_LIMIT } = req.query
  const quotes = await QuotesService.findRandomQuotes(limit)
  res.json(quotes)
})

export const getQuoteById = asyncErrorHandler(async (req, res) => {
  const quoteId = req.params.id
  const quote = await QuotesService.findSingleQuote(quoteId)
  if (quote) {
    res.json(quote)
  } else {
    res.status(404).json({ message: getQuoteNotFoundErrorMessage(quoteId) })
  }
})

export const deleteQuoteById = asyncErrorHandler(async (req, res) => {
  const quoteId = req.params.id
  const deletedQuoteId = await QuotesService.deleteSingleQuote(quoteId)
  if (deletedQuoteId) {
    res.status(204).send()
  } else {
    res.status(404).json({ message: getQuoteNotFoundErrorMessage(quoteId) })
  }
})

export const patchQuoteById = asyncErrorHandler(async (req, res) => {
  const quoteId = req.params.id
  const { text, author, categories } = req.body
  const updateData = { text, author, categories }
  const modifiedQuote = await QuotesService.modifySingleQuote(quoteId, updateData)
  if (modifiedQuote) {
    res.json(modifiedQuote)
  } else {
    res.status(404).json({ message: getQuoteNotFoundErrorMessage(quoteId) })
  }
})

export const postQuote = asyncErrorHandler(async (req, res) => {
  const { text, author, categories } = req.body
  const quote = await QuotesService.createQuote({ text, author, categories })
  res.status(200).json(quote)
})
