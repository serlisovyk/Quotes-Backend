export default class AppError extends Error {
  constructor({ statusCode, code, message, fields }) {
    super(message)

    this.name = this.constructor.name
    this.statusCode = statusCode
    this.code = code
    this.fields = fields
    this.isOperational = true
  }

  toResponse() {
    const { code, message, fields } = this
    const details = fields ? { fields } : {}
    const error = { code, message, ...details }

    return { error }
  }
}
