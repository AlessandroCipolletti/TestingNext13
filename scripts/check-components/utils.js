import fs from "fs"
import path from "path"

import { COMPONENTS_FOLDER_PATH } from "./constants.js"


/**
 * Checks if a local path corresponds to a folder
 * @param {string} [fileName] 
 * @returns bool
 */
export const isFolder = (fileName = "") => {
  return fs.lstatSync(fileName).isDirectory()
}


/**
 * Checks if a file exists. Supports async/await.
 * @param {string} [filePath]
 * @returns bool
 */
export const fileExists = async(filePath = "") => !!(await fs.promises.stat(filePath).catch(() => false))


/**
 * if param files=all ==> gets every subfolder of "components"
 * else ==> gets subfolders just for the components involved in the commit
 * @returns [{ name: "", path: "" }, ...]
 */
export const getComponentsList = async(getAll=false) => {
  let components = []

  if (getAll) {
    // get all existing components' folders
    components = fs.readdirSync(COMPONENTS_FOLDER_PATH)
  } else {
    // get just components included which are included in the commit
    components = Array.from(new Set(
      process.argv
        .filter(
          filenName => filenName.startsWith(`${COMPONENTS_FOLDER_PATH}/`)
        )
        .filter(
          fileName => fileName.match(/\//g).length === 2
        )
        .map(
          fileName => fileName.substring(fileName.indexOf("/") + 1, fileName.lastIndexOf("/"))
        )
    ))
  }

  components = components.map(
    fileName => ({
      name: fileName,
      path: path.join(COMPONENTS_FOLDER_PATH, fileName),
    })
  )
  components = await asyncFilter(components, async(component) => {
    return await fileExists(component.path) && isFolder(component.path)
  })

  return components
}

const asyncFilter = async (arr, predicate) => {
  const results = await Promise.all(arr.map(predicate))

  return arr.filter((_v, index) => results[index])
}