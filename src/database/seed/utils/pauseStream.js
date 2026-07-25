export default function pauseStream(stream, time) {
  stream.pause()

  return new Promise((resolve) => {
    setTimeout(() => {
      stream.resume()
      resolve()
    }, time)
  })
}
