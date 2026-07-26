import * as QuotesService from '#services/quotes'
import NotFoundError from '../../errors/classes/not-found.error.js'
import { ERROR_MESSAGE } from '#constants/errors.constant'
import {
  DEFAULT_OFFSET,
  DEFAULT_QUOTES_LIMIT,
  RANDOM_QUOTES_LIMIT,
  ROUTE,
} from '#constants/app.constant'
import { sendCreated, sendNoContent, sendOk } from '#utils/http/response'

export async function getQuotes(req, res) {
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

  sendOk(res, quotes)
}

export async function getRandomQuotes(req, res) {
  const { limit = RANDOM_QUOTES_LIMIT } = req.query

  const quotes = await QuotesService.findRandomQuotes(limit)

  sendOk(res, quotes)
}

export async function getQuoteById(req, res) {
  const quoteId = req.params.id

  const quote = await QuotesService.findSingleQuote(quoteId)

  if (!quote) throw new NotFoundError(ERROR_MESSAGE.QUOTE_NOT_FOUND(quoteId))

  sendOk(res, quote)
}

export async function deleteQuoteById(req, res) {
  const quoteId = req.params.id

  const isDeleted = await QuotesService.deleteSingleQuote(quoteId)

  if (!isDeleted) throw new NotFoundError(ERROR_MESSAGE.QUOTE_NOT_FOUND(quoteId))

  sendNoContent(res)
}

export async function patchQuoteById(req, res) {
  const quoteId = req.params.id

  const { text, author, categories } = req.body

  const updateData = { text, author, categories }

  const modifiedQuote = await QuotesService.modifySingleQuote(quoteId, updateData)

  if (!modifiedQuote) throw new NotFoundError(ERROR_MESSAGE.QUOTE_NOT_FOUND(quoteId))

  sendOk(res, modifiedQuote)
}

export async function postQuote(req, res) {
  const { text, author, categories } = req.body

  const quote = await QuotesService.createQuote({ text, author, categories })

  sendCreated(res, quote, `${ROUTE.QUOTES}/${quote.id}`)
}
