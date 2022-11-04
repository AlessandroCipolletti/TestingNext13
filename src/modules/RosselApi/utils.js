
export function formatApiParamsToString(params) {
  let result = ""

  if (Array.isArray(params)) {
    result = `/${params.join("/")}`
  } else if (typeof params === "object" && Object.keys(params).length) {
    result = "?" + Object.keys(params)
      .map((key) => { 
        if (Array.isArray(params[key])) {
          return `${key}=${params[key].join(",")}`
        }
        return `${key}=${params[key]}`
      })
      .join("&")
  }

  return result
}

export function replaceStringParams(string, params) {
  const queryParams = {}

  for (const key in params) {
    if (string.includes("${" + key + "}")) {
      string = string.replace("${" + key + "}", params[key])
    } else {
      queryParams[key] = params[key]
    }
  }

  return `${string}${formatApiParamsToString(queryParams)}`
}


export function formatApiUrlWithParams(url, params) {
  if (url.includes("${") && typeof params === "object") {
    return replaceStringParams(url, params)
  } else {
    return `${url}${formatApiParamsToString(params)}`
  }
}


export function checkAuthSucceeded(response) {
  if (response.status === 401) {
    // TODO do something if the users is no longer connected.
    // maybe redirect to the login page ?
    throw new Error("Authentification failed; redirecting...")
  }
  return response
}
