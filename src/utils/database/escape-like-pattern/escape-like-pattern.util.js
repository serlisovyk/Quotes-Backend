import { LIKE_SPECIAL_CHARS_REGEX } from '#constants/validation.constant'

export default function escapeLikePattern(value) {
  return String(value).replace(LIKE_SPECIAL_CHARS_REGEX, '\\$&')
}
