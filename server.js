import express from "express"
import next from "next"
// import { initDefaultCache } from "./src/modules/Cache/Cache.js"

const port = parseInt(process.env.PORT, 10) || 3000
const dev = process.env.NODE_ENV !== "production"
const app = next({ dev })
const handle = app.getRequestHandler()

app.prepare().then(async() => {
  const server = express()

  // await initDefaultCache()

  server.all("*", (req, res) => {
    return handle(req, res)
  })

  server.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`)
  })
})
