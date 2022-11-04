import fs from "fs"

import { getComponentsList } from "./utils.js"

import { COMPONENTS_FOLDER_PATH, SUCCESS, FAILURE } from "./constants.js"


let result = SUCCESS

/**
 * Checks if every subfolder of the "components" folder has an index.js file
 */
const checkComponentsIndex = async(components) => {
  const invalidComponents = (await Promise.all(components.map(
    component => new Promise((resolve) => {
      fs.lstat(`${component.path}/index.js`, (error) => {
        component = { ...component, hasIndex: !error }
        resolve(component)
      })
    })
  )))
    .filter(component => !component.hasIndex)
  
  if (invalidComponents.length === 0) return


  if (process.argv.includes("--fix")) {
    await Promise.all(invalidComponents.map(
      invalidComponent => new Promise(() => {
        fs.writeFile(
          `${invalidComponent.path}/index.js`,
          `import ${invalidComponent.name} from "./${invalidComponent.name}"\n\nexport default ${invalidComponent.name}`,
          (error) => {
            if (error) {
              result = FAILURE
              console.error(`Error while creating ${invalidComponent.name} index.js file.`)
            } else {
              console.log(`Created index.js file for component ${invalidComponent.name}.`)
            }
          },
        )
      })
    ))
  } else {
    result = FAILURE
    for (const component of invalidComponents) {
      console.error(`Component ${component.name} doesn't have a index.js file`)
    }
  }
}

/**
 * Checks if every public component is exported inside the components/index.js file
 */
const checkPublicComponentsExport = async(components) => {
  const publicComponents = (await Promise.all(components.map(
    component => new Promise((resolve) => {
      fs.readFile(`${component.path}/${component.name}.js`, "utf8", (error, data) => {
        let isPublic = false
        if (error) {
          result = FAILURE
          console.error(`Error reading ${component.path}/${component.name}.js file.`)
        } else {
          isPublic = data.includes(`${component.name}.isPublic = true`)
        }
        component = { ...component, isPublic }
        resolve(component)
      })
    })
  )))
    .filter(component => component.isPublic)
  
  if (result === FAILURE) return


  let indexContent = ""

  if (publicComponents.length > 0) {
    const imports = publicComponents.map(
      component => `import ${component.name} from "./${component.name}"\n`
    ).join("")
    const list = publicComponents.map(component => `  ${component.name},`).join("\n")

    indexContent = `${imports}\nconst components = {\n${list}\n}\n\nexport default components`
  }

  fs.writeFileSync(`${COMPONENTS_FOLDER_PATH}/index.js`, indexContent)
  console.log(`Updated ${COMPONENTS_FOLDER_PATH}/index.js file.`)
}

/**
 * Script body
 */
const run = async() => {
  if (!fs.existsSync(COMPONENTS_FOLDER_PATH)) return

  await checkComponentsIndex(await getComponentsList(process.argv.includes("files=all")))
  await checkPublicComponentsExport(await getComponentsList(true))
}


await run()

process.exit(result)