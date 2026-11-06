import * as HealthService from '#services/health'
import { sendOk, sendServiceUnavailable } from '#utils/http/response'
import { HEALTH_STATUS } from '#constants'

export async function getHealth(_, res) {
  const isDatabaseAvailable = await HealthService.isDatabaseAvailable()

  if (!isDatabaseAvailable) {
    return sendServiceUnavailable(res, HEALTH_STATUS.ERROR)
  }

  return sendOk(res, HEALTH_STATUS.OK)
}
