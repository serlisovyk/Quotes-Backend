import { validationResult } from 'express-validator'

export async function runValidators(validators, req) {
  for (const validator of validators) {
    await validator.run(req)
  }

  return validationResult(req)
}
