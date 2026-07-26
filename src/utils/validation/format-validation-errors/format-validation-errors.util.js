import { VALIDATION_ROOT_FIELD } from '#constants/validation.constant'

export default function formatValidationErrors(errors) {
  return errors.array().reduce((fields, error) => {
    fields[error.path || VALIDATION_ROOT_FIELD] = error.msg

    return fields
  }, {})
}
