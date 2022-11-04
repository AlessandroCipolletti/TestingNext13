import {
  formatApiParamsToString,
  replaceStringParams,
  formatApiUrlWithParams,
  checkAuthSucceeded,
} from "../utils"


describe("RosselApi - utils", () => {
  it("formatApiParamsToString() with array params", () => {
    // Given
    const params = ["param1", "param2"]
    const expected = "/param1/param2"

    // When
    const result = formatApiParamsToString(params)

    // Then
    expect(result).toBe(expected)
  })

  it("formatApiParamsToString() with object params", () => {
    // Given
    const params = {
      param1: "value1",
      param2: "value2",
    }
    const expected = "?param1=value1&param2=value2"

    // When
    const result = formatApiParamsToString(params)

    // Then
    expect(result).toBe(expected)
  })

  it("formatApiParamsToString() with object params using an array", () => {
    // Given
    const params = {
      param1: "value1",
      param2: ["value2", "value3"],
    }
    const expected = "?param1=value1&param2=value2,value3"

    // When
    const result = formatApiParamsToString(params)

    // Then
    expect(result).toBe(expected)
  })

  it("formatApiParamsToString() with empty object params", () => {
    // Given
    const params = {}
    const expected = ""

    // When
    const result = formatApiParamsToString(params)

    // Then
    expect(result).toBe(expected)
  })

  it("formatApiParamsToString() with bad params", () => {
    // Given
    const params = "params"
    const expected = ""

    // When
    const result = formatApiParamsToString(params)

    // Then
    expect(result).toBe(expected)
  })

  it("replaceStringParams() with just url params", () => {
    // Given
    const string = "ciao io sono una stringa in italiano con 1 ${param1} ed una ${param2}"
    const params = {
      param1: "banana",
      param2: "scarpa",
    }
    const expected = "ciao io sono una stringa in italiano con 1 banana ed una scarpa"

    // When
    const result = replaceStringParams(string, params)

    // Then
    expect(result).toBe(expected)
  })

  it("replaceStringParams() with just query params", () => {
    // Given
    const string = "http://www.metro.be"
    const params = {
      param1: "banana",
      param2: "scarpa",
    }
    const expected = "http://www.metro.be?param1=banana&param2=scarpa"

    // When
    const result = replaceStringParams(string, params)

    // Then
    expect(result).toBe(expected)
  })

  it("replaceStringParams() with url and query params at the same time", () => {
    // Given
    const string = "http://www.metro.be/projectId/${projectId}"
    const params = {
      projectId: "1111",
      param2: "scarpa",
    }
    const expected = "http://www.metro.be/projectId/1111?param2=scarpa"

    // When
    const result = replaceStringParams(string, params)

    // Then
    expect(result).toBe(expected)
  })

  it("formatApiUrlWithParams() with object params", () => {
    // Given
    const url = "ciao io sono una stringa in italiano con 1 ${param1} ed una ${param2}"
    const params = {
      param1: "banana",
      param2: "scarpa",
    }
    const expected = "ciao io sono una stringa in italiano con 1 banana ed una scarpa"

    // When
    const result = formatApiUrlWithParams(url, params)

    // Then
    expect(result).toBe(expected)
  })

  it("formatApiUrlWithParams() with array params", () => {
    // Given
    const url = "http://metro.be"
    const params = ["param1", "param2"]
    const expected = "http://metro.be/param1/param2"

    // When
    const result = formatApiUrlWithParams(url, params)

    // Then
    expect(result).toBe(expected)
  })

  it("checkAuthSucceeded() with 401 response should throw an error", () => {
    // Given
    const response = {
      status: 401,
    }

    // When
    const test = () => {
      checkAuthSucceeded(response)
    }

    // Then
    expect(test).toThrow()
  })

  it("checkAuthSucceeded() should return the same response object takes as param", () => {
    // Given
    const response = {
      status: 200,
    }

    // When
    const result = checkAuthSucceeded(response)

    // Then
    expect(result).toBe(response)
  })
})
