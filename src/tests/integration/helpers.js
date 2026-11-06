import request from 'supertest'
import app from '#app'
import { HTTP_STATUS, ROUTE } from '#constants'

export const client = request(app)

export async function createQuote({
  text = 'A default quote used by the tests',
  author = 'Test Author',
  categories = ['default'],
} = {}) {
  const response = await client.post(ROUTE.QUOTES).send({ text, author, categories })

  if (response.status !== HTTP_STATUS.CREATED) {
    throw new Error(`Quote was not created: ${response.status}`)
  }

  return response.body
}
