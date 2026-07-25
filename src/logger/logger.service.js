class Logger {
  static info(message) {
    console.log(`ℹ️ ${message}`)
  }

  static success(message) {
    console.log(`✅ ${message}`)
  }

  static warn(message) {
    console.warn(`⚠️ ${message}`)
  }

  static error(message, error) {
    console.error(`❌ ${message}`)

    if (error) console.error(error)
  }
}

export default Logger
