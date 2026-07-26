import { sendOk } from '#utils/http/response'

export function getHealth(_, res) {
  sendOk(res, { status: 'ok' })
}
