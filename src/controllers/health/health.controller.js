import { sendOk } from '../../utils/http/response/index.js'

export function getHealth(_, res) {
  sendOk(res, { status: 'ok' })
}
