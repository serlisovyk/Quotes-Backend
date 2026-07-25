import { VALIDATION_ROOT_FIELD } from '../../constants/validation.js'

export default function formatValidationErrors(errors) {
  return errors.array().reduce((fields, error) => {
    fields[error.path || VALIDATION_ROOT_FIELD] = error.msg

    return fields
  }, {})
}
