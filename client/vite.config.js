import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'node:fs'
import path from 'node:path'

const dataFilePath = path.resolve(__dirname, '..', 'data', 'settei.json')

function jsonFileApiPlugin() {
  return {
    name: 'json-file-api',
    configureServer(server) {
      server.middlewares.use('/api/data', (req, res) => {
        if (req.method === 'GET') {
          const content = fs.readFileSync(dataFilePath, 'utf-8')
          res.setHeader('Content-Type', 'application/json')
          res.end(content)
          return
        }
        if (req.method === 'POST') {
          let body = ''
          req.on('data', (chunk) => {
            body += chunk
          })
          req.on('end', () => {
            fs.writeFileSync(dataFilePath, body, 'utf-8')
            res.statusCode = 204
            res.end()
          })
          return
        }
        res.statusCode = 405
        res.end()
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), jsonFileApiPlugin()],
})
