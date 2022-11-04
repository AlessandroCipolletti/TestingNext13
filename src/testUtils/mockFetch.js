
/**
 * Replaces the native fetch method with a mocked one.
 * You can pass an expected response status and an expected response data 
 * 
 * @function
 * @param {number} [status]
 * @param {object} [expectedResponseData] - The data that you want to return from the mock fetch call.
 */
const mockFetch = (status = 200, expectedResponseData = {}) => {
  // if fetch is already mocked by another test, it must be reset
  global.fetch && global.fetch.mockReset && global.fetch.mockReset()

  global.fetch = jest.fn(async () => ({
    status,
    json: async () => expectedResponseData,
  }))
}

export default mockFetch