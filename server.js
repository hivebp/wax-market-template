const express = require('express')
const next = require('next')

process.title = 'wax-marketplace (server, node)'
// const hostname = process.env.HOSTNAME ?? 'localhost'
// const port = parseInt(process.env.PORT, 10) || 3001

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()
const { parse } = require('url')

app.prepare()
    .then(() => {
        const server = express()

        server.get('*', (req, res) => {
            const parsedUrl = parse(req.url, true)
            return handle(req, res, parsedUrl)
        })

        server.listen(3001, (err) => {
            if (err) throw err
            console.log('> Ready on http://localhost:3001')
        })
    })
    .catch((ex) => {
        console.error(ex.stack)
        process.exit(1)
    })
