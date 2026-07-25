import { sendOk } from '../utils/http/response.util.js'

export function getHealth(_, res) {
  sendOk(res, { status: 'ok' })
}
