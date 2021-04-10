const express = require('express')
const morgan = require('morgan')
const path = require('path')
const routes = require('./routes')

const server = express()

server.set('view engine', 'ejs')
server.set('views', path.join(__dirname, 'views'))

server.use(express.static("public"))

server.use(express.urlencoded({ extended: true }))

server.use(morgan(":status :method :url :response-time ms - :res[content-length]"))
server.use(routes)

server.listen(3000, () => {
  console.log('Running app on localhost:3000');
})
