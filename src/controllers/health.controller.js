export function getHealth(_, res) {
  res.status(200).json({ status: 'ok' })
}
