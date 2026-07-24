export const attributes = { exclude: ['createdAt', 'updatedAt'] }

export const getQuoteNotFoundErrorMessage = (id) => `Quote with ID ${id} not found`

export const DEFAULT_QUOTES_LIMIT = 10

export const RANDOM_QUOTES_LIMIT = 10

// Allows lowercase letters, numbers and dashes
export const CATEGORY_NAME_REGEX = /^[a-z0-9\-]+$/

// Allows any letters, numbers and dashes
export const CATEGORY_NAME_I_REGEX = /^[a-z0-9\-]+$/i
