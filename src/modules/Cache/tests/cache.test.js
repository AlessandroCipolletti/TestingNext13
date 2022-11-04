import { CacheConnection, initDefaultCache } from "../Cache"
import { DEFAULT_CACHE_URL, DEFAULT_CACHE_DURATION } from "../cacheConfig"


let testCache, createClientMock

describe("Cache", () => {
  beforeEach(() => {
    testCache = new CacheConnection()
    createClientMock = jest.fn(() => ({
      on: jest.fn(),
      connect: jest.fn(),
      sendCommand: jest.fn(),
      set: jest.fn(),
      get: jest.fn(),
    }))
  })

  afterEach(() => {
    testCache = undefined
  })

  it("should use default params", async () => {
    // Given
    const expectedCreateClientParam = {
      url: DEFAULT_CACHE_URL,
    }
    const expectedEmtyDbParam = ["FLUSHDB"]

    // When
    await testCache.connect({ createClientApi: createClientMock })

    // Then
    expect(testCache.duration).toEqual(DEFAULT_CACHE_DURATION)
    expect(createClientMock).toHaveBeenCalledWith(expectedCreateClientParam)
    expect(createClientMock).toHaveBeenCalledTimes(1)
    expect(testCache.client.sendCommand).toHaveBeenCalledTimes(1)
    expect(testCache.client.sendCommand).toHaveBeenCalledWith(expectedEmtyDbParam)
  })

  it("should use given params", async () => {
    // Given
    const url = "url"
    const duration = 123
    const emptyDb = false
    const expectedParam = {
      url,
    }

    // When
    await testCache.connect({ url, duration, emptyDb, createClientApi: createClientMock })

    // Then
    expect(testCache.duration).toEqual(duration)
    expect(createClientMock).toHaveBeenCalledWith(expectedParam)
    expect(createClientMock).toHaveBeenCalledTimes(1)
    expect(testCache.client.sendCommand).not.toHaveBeenCalled()
  })

  it("should attach an error handler on connect()", async () => {
    // Given

    // When
    await testCache.connect({ createClientApi: createClientMock })

    // Then
    expect(testCache.client.on).toHaveBeenCalledTimes(1)
  })

  it("should call the createClientApi connect method on connect()", async () => {
    // Given

    // When
    await testCache.connect({ createClientApi: createClientMock })

    // Then
    expect(testCache.client.connect).toHaveBeenCalledTimes(1)
  })

  it("should call the createClientApi set method on addElement() with a specific TTL", async () => {
    // Given
    const key = "key"
    const value = "value"
    const expectedValue = JSON.stringify(value)
    const duration = 10
    const options = {
      EX: duration,
    }

    // When
    await testCache.connect({ createClientApi: createClientMock })
    await testCache.addElement(key, value, duration)

    // Then
    expect(testCache.client.set).toHaveBeenCalledTimes(1)
    expect(testCache.client.set).toHaveBeenCalledWith(key, expectedValue, options)
  })

  it("should call the createClientApi set method on addElement() with default TTL", async () => {
    // Given
    const key = "key"
    const value = "value"
    const expectedValue = JSON.stringify(value)
    const options = {
      EX: DEFAULT_CACHE_DURATION,
    }

    // When
    await testCache.connect({ createClientApi: createClientMock })
    await testCache.addElement(key, value)

    // Then
    expect(testCache.client.set).toHaveBeenCalledTimes(1)
    expect(testCache.client.set).toHaveBeenCalledWith(key, expectedValue, options)
  })

  it("should call the createClientApi set method on addElement() with no TTL", async () => {
    // Given
    const key = "key"
    const value = "value"
    const duration = 0
    const expectedValue = JSON.stringify(value)

    // When
    await testCache.connect({ createClientApi: createClientMock })
    await testCache.addElement(key, value, duration)

    // Then
    expect(testCache.client.set).toHaveBeenCalledTimes(1)
    expect(testCache.client.set).toHaveBeenCalledWith(key, expectedValue)
  })

  it("should return null on getElement() with a inexistent key", async () => {
    // Given
    const key = "key"
    const expected = null

    // When
    await testCache.connect({ createClientApi: createClientMock })
    const result = await testCache.getElement(key)

    // Then
    expect(result).toBe(expected)
  })

  it("should return null on getElement() without a key", async () => {
    // Given
    const expected = null

    // When
    await testCache.connect({ createClientApi: createClientMock })
    const result = await testCache.getElement()

    // Then
    expect(result).toBe(expected)
  })

  it("should return null on getElement() with a non-string key", async () => {
    // Given
    const key = 123
    const expected = null

    // When
    await testCache.connect({ createClientApi: createClientMock })
    const result = await testCache.getElement(key)

    // Then
    expect(result).toBe(expected)
  })

  it("should return the right value on getElement()", async () => {
    // Given
    const key = "key"
    const value = "value"
    const cachedValue = JSON.stringify(value)
    const expected = value

    // When
    await testCache.connect({ createClientApi: createClientMock })
    testCache.client.get.mockResolvedValueOnce(cachedValue)
    const result = await testCache.getElement(key)

    // Then
    expect(result).toBe(expected)
  })

  it("should return true on hasElement() for an existing key", async () => {
    // Given
    const existsCommandResult = 1
    const key = "key"
    const expected = true

    // When
    await testCache.connect({ createClientApi: createClientMock })
    testCache.client.sendCommand.mockResolvedValueOnce(existsCommandResult)
    const result = await testCache.hasElement(key)

    // Then
    expect(result).toBe(expected)
  })

  it("should return false on hasElement() for an empty key", async () => {
    // Given
    const existsCommandResult = 1
    const expected = false

    // When
    await testCache.connect({ createClientApi: createClientMock })
    testCache.client.sendCommand.mockResolvedValueOnce(existsCommandResult)
    const result = await testCache.hasElement()

    // Then
    expect(result).toBe(expected)
  })

  it("should return false on hasElement() for a non string key", async () => {
    // Given
    const existsCommandResult = 1
    const key = 123
    const expected = false

    // When
    await testCache.connect({ createClientApi: createClientMock })
    testCache.client.sendCommand.mockResolvedValueOnce(existsCommandResult)
    const result = await testCache.hasElement(key)

    // Then
    expect(result).toBe(expected)
  })

  it("should return false on hasElement() for a inexistent key", async () => {
    // Given
    const existsCommandResult = 0
    const key = "key"
    const expected = false

    // When
    await testCache.connect({ createClientApi: createClientMock })
    testCache.client.sendCommand.mockResolvedValueOnce(existsCommandResult)
    const result = await testCache.hasElement(key)

    // Then
    expect(result).toBe(expected)
  })

  it("should call the cahce DEL command on deleteElement()", async () => {
    // Given
    const key = "key"
    const expectedParam = ["DEL", key]

    // When
    await testCache.connect({ emptyDb: false, createClientApi: createClientMock })
    await testCache.deleteElement(key)

    // Then
    expect(testCache.client.sendCommand).toHaveBeenCalledTimes(1)
    expect(testCache.client.sendCommand).toHaveBeenCalledWith(expectedParam)
  })

  it("should init the default cache", async () => {
    // Given
    const connectMock = jest.fn()
    createClientMock = jest.fn(() => ({
      on: jest.fn(),
      connect: connectMock,
      sendCommand: jest.fn(),
      set: jest.fn(),
      get: jest.fn(),
    }))

    // When
    await initDefaultCache(createClientMock)

    // Then
    expect(connectMock).toHaveBeenCalledTimes(1)
  })

})
