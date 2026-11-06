import { sendOk } from '#utils/http/response'
import { API_INFO } from '#constants'

export function getRoot(_, res) {
  return sendOk(res, API_INFO)
}
