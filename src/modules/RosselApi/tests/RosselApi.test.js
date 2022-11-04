import { callApi } from "../RosselApi"
import mockFetch from "@/testUtils/mockFetch"
import { formatApiUrlWithParams } from "../utils"
import Cache  from "@/modules/Cache/Cache"

jest.mock("../utils")
jest.mock("@/modules/Cache/Cache")


describe("RosselApi", () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  afterAll(() => {
    jest.restoreAllMocks()
  })

  it("should return false if called without an url", async () => {
    // Given
    const url = undefined
    const api = callApi({ url })
    const expected = [false, false]

    // When
    const result = await api()

    // Then
    expect(result).toEqual(expected)
  })

  it("should call formatApiUrlWithParams to format apiUrl", async () => {
    // Given
    const url = "url"
    const params = "params"
    const api = callApi({ url })
    const mock = jest.fn()
    formatApiUrlWithParams.mockImplementation(mock)
    mockFetch()

    // When
    await api({ params })

    // Then
    expect(mock).toHaveBeenCalledTimes(1)
    expect(mock).toHaveBeenCalledWith(url, params)
    expect(global.fetch).toHaveBeenCalledTimes(1)
  })

  it("should call Cache.hasElement if cacheDuration > 0", async () => {
    // Given
    const url = "url"
    const cacheDuration = 10
    const body = { key: "value" }
    const bodyString = JSON.stringify(body)
    const cacheKey = `url+${bodyString}`
    const api = callApi({ url, cacheDuration })
    formatApiUrlWithParams.mockImplementation(jest.fn(url => url))
    mockFetch()

    // When
    await api({ body })
    
    // Then
    expect(Cache.hasElement).toHaveBeenCalledTimes(1)
    expect(Cache.hasElement).toHaveBeenCalledWith(cacheKey)
  })

  it("should NOT call an api fetch if the requested api is present inside the cache", async () => {
    // Given
    const url = "url"
    const cacheDuration = 10
    const api = callApi({ url, cacheDuration })
    Cache.hasElement.mockImplementationOnce(() => true)
    mockFetch()

    // When
    await api()

    // Then
    expect(Cache.hasElement).toHaveBeenCalledTimes(1)
    expect(Cache.getElement).toHaveBeenCalledTimes(1)
    expect(Cache.addElement).toHaveBeenCalledTimes(0)
    expect(global.fetch).toHaveBeenCalledTimes(0)
  })

  it("should call an api fetch if the requested api is not present inside the cache", async () => {
    // Given
    const url = "url"
    const cacheDuration = 10
    const api = callApi({ url, cacheDuration })
    Cache.hasElement.mockImplementationOnce(() => false)
    mockFetch()

    // When
    await api()

    // Then
    expect(Cache.hasElement).toHaveBeenCalledTimes(1)
    expect(Cache.getElement).toHaveBeenCalledTimes(0)
    expect(Cache.addElement).toHaveBeenCalledTimes(1)
    expect(global.fetch).toHaveBeenCalledTimes(1)
  })


  it("should return true if the fetch response has status = 204", async () => {
    // Given
    const url = "url"
    const api = callApi({ url })
    mockFetch(204)

    // When
    const [result] = await api()

    // Then
    expect(result).toBe(true)
  })

  it("should return the 'data' response key if status = 200", async () => {
    // Given
    const url = "url"
    const api = callApi({ url })
    const data = "data"
    mockFetch(200, { data })

    // When
    const [result] = await api()

    // Then
    expect(result).toBe(data)
  })

  it("should return the 'data' response key if status = 201", async () => {
    // Given
    const url = "url"
    const api = callApi({ url })
    const data = "data"
    mockFetch(201, { data })

    // When
    const [result] = await api()

    // Then
    expect(result).toBe(data)
  })

  it("should return the 'data' response key if status = 202", async () => {
    // Given
    const url = "url"
    const api = callApi({ url })
    const data = "data"
    mockFetch(202, { data })

    // When
    const [result] = await api()

    // Then
    expect(result).toBe(data)
  })

  it("should return the json() response key if status !== 200|201|202|204", async () => {
    // Given
    const url = "url"
    const api = callApi({ url })
    const jsonResponse = "jsonResponse"
    const expectedResult = false
    const expectedResponse = jsonResponse
    mockFetch(205, jsonResponse)

    // When
    const [result, response] = await api()

    // Then
    expect(result).toBe(expectedResult)
    expect(response).toBe(expectedResponse)
  })

})