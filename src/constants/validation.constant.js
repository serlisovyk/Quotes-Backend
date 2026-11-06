export const MAX_ENTITY_ID = 2147483647

export const VALIDATION_ROOT_FIELD = '_root'

export const QUOTE_TEXT_MIN_LENGTH = 10

export const QUOTE_TEXT_MAX_LENGTH = 2500

export const QUOTE_AUTHOR_MIN_LENGTH = 2

export const QUOTE_AUTHOR_MAX_LENGTH = 255

export const MAX_CATEGORIES_PER_QUOTE = 10

export const CATEGORY_NAME_MAX_LENGTH = 50

export const QUOTE_SEARCH_MAX_LENGTH = 100

export const QUOTE_SORT_FIELDS = ['id', 'author', 'createdAt']

export const SORT_ORDERS = ['asc', 'desc']

export const QUOTE_PATCH_FIELDS = ['text', 'author', 'categories']

export const CATEGORY_NAME_REGEX = /^[a-z0-9-]+$/

export const CATEGORY_NAME_I_REGEX = /^[a-z0-9-]+$/i

export const CATEGORY_UPPERCASE_REGEX = /[A-Z]/

export const LIKE_SPECIAL_CHARS_REGEX = /[\\%_]/g
