import { validationResult } from 'express-validator'

export async function runValidators(validators, req) {
  await Promise.all(validators.map((validator) => validator.run(req)))

  return validationResult(req)
}
