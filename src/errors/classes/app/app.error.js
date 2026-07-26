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
    return {
      error: {
        code: this.code,
        message: this.message,
        ...(this.fields ? { fields: this.fields } : {}),
      },
    }
  }
}
