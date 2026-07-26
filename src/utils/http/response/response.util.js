import { HTTP_STATUS } from '#constants/app.constant'

export function sendOk(res, data) {
  return res.status(HTTP_STATUS.OK).json(data)
}

export function sendCreated(res, data, location) {
  if (location) res.location(location)

  return res.status(HTTP_STATUS.CREATED).json(data)
}

export function sendNoContent(res) {
  return res.status(HTTP_STATUS.NO_CONTENT).send()
}
