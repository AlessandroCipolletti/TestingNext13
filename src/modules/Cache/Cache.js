import { createClient } from "redis"

import { DEFAULT_CACHE_URL, DEFAULT_CACHE_DURATION } from "./cacheConfig.js"


let Cache

/**
 * Allows to cache string values, with a default time to live of 60 seconds.
 * 
 * @class CacheConnection
 * @example
 * .connect() accepts optinal parameters: "url" for redis server, and "duration" for the default TTL value.
 * defaults values are available inside the config.
 * 
 * const Cache = new CacheConnection()
 * await Cache.connect()
 * 
 * await Cache.addElement("myKey", "myValue") // TTL = 60 seconds
 * await Cache.addElement("myKey", "myValue", 0) // this one never expires
 * await Cache.addElement("myKey", "myValue", 30) // TTL = 30 seconds
 * await Cache.hasElement("myKey") // true || false
 * await Cache.getElement("myKey") // "myValue"
 * await Cache.deleteElement("myKey")
 */
export class CacheConnection {

  /**
   * Connects to the cache server
   * 
   * @async
   * @function connect
   * @param {object} options
   * @param {string} [options.url]
   * @param {number} [options.duration]
   * @param {bool} [options.emptyDb]
   */
  async connect({
    url = DEFAULT_CACHE_URL,
    duration = DEFAULT_CACHE_DURATION,
    emptyDb = true,
    createClientApi = createClient,
  } = {}) {
    this.client = createClientApi({
      url,
    })
    this.duration = duration
    this.client.on("error", (err) => console.log("Redis Client Error", err))
    await this.client.connect()

    if (emptyDb) {
      await this.client.sendCommand(["FLUSHDB"])
    }
  }

  /**
   * Adds a new cached value
   * 
   * @async
   * @function addElement
   * @param {string} key
   * @param {any} value
   * @param {number} [duration]
   */
  async addElement(key, value, duration = this.duration) {
    value = JSON.stringify(value)
    if (duration > 0) {
      await this.client.set(key, value, {
        EX: duration,
      })
    } else {
      await this.client.set(key, value)
    }
  }

  /**
   * Gets a cached value (by its key) or null
   * 
   * @async
   * @function getElement
   * @param {string} key 
   * @returns {any|null}
   */
  async getElement(key) {
    if (!key || typeof(key) !== "string") {
      return null
    }
    const value = await this.client.get(key)
    if (typeof(value) === "undefined") {
      return null
    }
    return JSON.parse(value)
  }

  /**
   * Checks if the given key is present inside the cache
   * 
   * @async
   * @function hasElement
   * @param {string} key 
   * @returns {bool}
   */
  async hasElement(key) {
    if (typeof(key) !== "string") {
      return false
    }
    return parseInt(await this.client.sendCommand(["EXISTS", key])) > 0
  }

  /**
   * Delete a cached key
   * 
   * @async
   * @function deleteElement
   * @param {string} key - The key of the element to delete.
   */
  async deleteElement(key) {
    await this.client.sendCommand(["DEL", key])
  }

}

/**
 * Init the default Cache object
 * 
 * @async
 * @function initDefaultCache
 */
export const initDefaultCache = async (createClientApi = createClient) => {
  Cache = new CacheConnection()
  await Cache.connect({ createClientApi })
  // if (process.env.NODE_ENV !== "production") { // TODO pour le front-end
  //   Cache.on("connect", (data) => {
  //     console.log("connect", data)
  //   })
  //   Cache.on("ready", (data) => {
  //     console.log("ready", data)
  //   })
  //   Cache.on("end", (data) => {
  //     console.log("end", data)
  //   })
  //   Cache.on("reconnecting", (data) => {
  //     console.log("reconnecting", data)
  //   })
  //   Cache.on("connect", (data) => {
  //     console.log("connect", data)
  //   })
  // }
}


export default Cache
