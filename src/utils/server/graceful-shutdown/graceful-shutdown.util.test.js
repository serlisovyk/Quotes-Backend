import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import Logger from '../../../logger/logger.service.js'
import closeDatabaseConnection from '../../database/close-database-connection/index.js'
import registerGracefulShutdown from './index.js'

vi.mock('../../../logger/logger.service.js', () => ({
  default: {
    error: vi.fn(),
    info: vi.fn(),
  },
}))

vi.mock('../../database/close-database-connection/index.js', () => ({
  default: vi.fn(),
}))

async function flushPromises() {
  await new Promise((resolve) => setImmediate(resolve))
}

describe('GracefulShutdown Util', () => {
  let handlers
  let processExitSpy
  let processOnSpy

  beforeEach(() => {
    vi.clearAllMocks()
    handlers = {}

    processOnSpy = vi.spyOn(process, 'on').mockImplementation((signal, handler) => {
      handlers[signal] = handler

      return process
    })

    processExitSpy = vi.spyOn(process, 'exit').mockImplementation(() => undefined)
  })

  afterEach(() => vi.restoreAllMocks())

  test('registers shutdown handlers for process termination signals', () => {
    const server = { close: vi.fn() }

    registerGracefulShutdown(server)

    expect(processOnSpy).toHaveBeenCalledWith('SIGINT', expect.any(Function))
    expect(processOnSpy).toHaveBeenCalledWith('SIGTERM', expect.any(Function))
  })

  test('closes server and database connection before successful exit', async () => {
    const server = { close: vi.fn((callback) => callback()) }

    closeDatabaseConnection.mockResolvedValue()
    registerGracefulShutdown(server)

    handlers.SIGINT()
    await flushPromises()

    expect(Logger.info).toHaveBeenCalledWith('Received SIGINT. Closing server...')
    expect(server.close).toHaveBeenCalledWith(expect.any(Function))
    expect(closeDatabaseConnection).toHaveBeenCalled()
    expect(processExitSpy).toHaveBeenCalledWith(0)
  })

  test('exits with failure when server cannot close', async () => {
    const error = new Error('Server close failed')
    const server = { close: vi.fn((callback) => callback(error)) }

    registerGracefulShutdown(server)

    handlers.SIGTERM()
    await flushPromises()

    expect(Logger.error).toHaveBeenCalledWith('Unable to close HTTP server', error)
    expect(closeDatabaseConnection).not.toHaveBeenCalled()
    expect(processExitSpy).toHaveBeenCalledWith(1)
  })

  test('exits with failure when database connection cannot close', async () => {
    const error = new Error('Database close failed')
    const server = { close: vi.fn((callback) => callback()) }

    closeDatabaseConnection.mockRejectedValue(error)
    registerGracefulShutdown(server)

    handlers.SIGINT()
    await flushPromises()

    expect(Logger.error).toHaveBeenCalledWith(
      'Unable to close database connection',
      error,
    )
    expect(processExitSpy).toHaveBeenCalledWith(1)
  })
})
