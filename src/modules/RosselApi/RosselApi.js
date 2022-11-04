import Apis from "./apisConfig"
import { formatApiUrlWithParams } from "./utils"
import Cache from "@/modules/Cache/Cache"
import { MAX_CACHE_KEY_LENGTH } from "@/modules/Cache/cacheConfig"

import {
  HTTP_STATUS_CODE_OK,
  HTTP_STATUS_CODE_CREATED,
  HTTP_STATUS_CODE_ACCEPTED,
  HTTP_STATUS_CODE_NO_CONTENT,
} from "./constants"

/**
 * @example
 * Inside apisConfig.js
 * getArticles: api("/articles"),                             // GET, with default cache, public
 * getOneArticle: api("/articles/${id}"),                     // GET, with default cache, public
 * saveArticle: api("/articles", PUT, 0, false),              // PUT, without cache, private
 * updateArticle: api("/articles/${id}", PATCH, 0, false),    // PATCH, without cache, private
 * deleteArticle: api("/articles/${id}", DELETE, 0, false),   // DELETE, without cache, private
 *
 * Wherever you want
 * const [articles] = await RosselApi.getArticles()
 *
 * const params = { id: 123 }
 * const [article] = await RosselApi.getOneArticle({ params })
 *
 * const body = { key: "value" }
 * const [result] = await RosselApi.saveArticle({ body })
 *
 * const params = { id: 123 }
 * const body = { key: "value" }
 * const [result] = await RosselApi.updateArticle({ params, body })
 *
 * const params = { id: 123 }
 * const [result, response] = await RosselApi.deleteArticle({ params })
 *  --> You can access the native 'response' here
 *
 * NB:
 * - If you need to do some custom validation, you can access the native fetch response using the second param
 * - If something goes wrong, no error is throw, but the first returned param is false
 * - If the api returns nothing, the first param contains at least true or false
 * - If the api uses cache, when you receive a cached value you cannot access the native 'response' object, because no call has been made.
 */

export const callApi = ({
  url,
  method,
  cacheDuration,
  // isPublic,
} /*, apiName */) => async ({ params, body } = {}) => {
  if (!url) {
    return [false, false]
  }

  const apiUrl = formatApiUrlWithParams(url, params)
  const bodyString = body ? JSON.stringify(body) : ""
  const cacheKey = `${apiUrl}+${bodyString}`.substring(0, MAX_CACHE_KEY_LENGTH)

  if (cacheDuration > 0 && (await Cache.hasElement(cacheKey))) {
    // returns the last cached value
    return [await Cache.getElement(cacheKey), false]
  } else {
    // needs to fetch the api
    const options = {
      method,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    }

    // if (!isPublic) { // TODO to check how backend apis work
    //   options.credentials = "include"
    // }
    
    if (method !== "GET" && body) {
      options.body = bodyString
    }

    let result, response
    try {
      response = await fetch(apiUrl, options)
      
      // if (!isPublic) {
      //   response = checkAuthSucceeded(response)
      // }

      if (response.status === HTTP_STATUS_CODE_NO_CONTENT) {
        result = true
      } else if ([HTTP_STATUS_CODE_OK, HTTP_STATUS_CODE_CREATED, HTTP_STATUS_CODE_ACCEPTED].includes(response.status)) {
        response = await response.json()
        result = response.data
      } else {
        response = await response.json()
        result = false
      }

      if (cacheDuration > 0) {
        /* await */ Cache.addElement(cacheKey, result, cacheDuration)
      }

      // if (debugMode) { // TODO?
      //   console.log(`Api call: ${apiName} : ${result}`)
      // }

      return [result, response]
    } catch (e) {
      if (response && !response.bodyUsed) {
        response = await response.json()
      }

      return [false, response]
    }
  }
}

const RosselApi = {}

for (const api in Apis) {
  RosselApi[api] = callApi(Apis[api], api)
}

// Apis.map
export default RosselApi
