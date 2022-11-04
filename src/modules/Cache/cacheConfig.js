// const REDIS_USERNAME = ""
// const REDIS_PASSWORD = ""
const REDIS_HOST = "127.0.0.1"
const REDIS_PORT = 6379
const REDIS_DB = 0


// complete redis url: `redis://${username}:${password}@${host}:${port}/${db-number}`
export const DEFAULT_CACHE_URL = `redis://${REDIS_HOST}:${REDIS_PORT}/${REDIS_DB}`


// We should put this param inside a root-level config file
export const DEFAULT_CACHE_DURATION = 60 // seconds


export const MAX_CACHE_KEY_LENGTH = 256 // chars