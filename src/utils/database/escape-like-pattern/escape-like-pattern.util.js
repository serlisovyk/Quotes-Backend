import { LIKE_SPECIAL_CHARS_REGEX } from '#constants'

export default function escapeLikePattern(value) {
  return String(value).replace(LIKE_SPECIAL_CHARS_REGEX, '\\$&')
}
