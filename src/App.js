const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')

// import public route
const authRoute = require('../src/routes/auth')

// import private route
const usersRoute = require('../src/routes/users')
const messageRoute = require('../src/routes/message')
const friendRoute = require('../src/routes/friend')

// import middleware
const authMidlleware = require('../src/middlewares/auth')

const app = express()
const { APP_PORT } = process.env

const server = require('http').createServer(app)
const io = require('socket.io')(server, {})
const data = require('./helpers/socket')
data.io = io
io.on('connection', () => {
  console.log('An user connected to our socket')
})

// enable CORS
app.use(cors())

app.use(bodyParser.urlencoded({ extended: false }))
app.use(morgan('dev'))
app.use('/uploads', express.static('assets/uploads'))

// define public route
app.use('/auth', authRoute)

// define private route
app.use('/users', authMidlleware, usersRoute)
app.use('/message', authMidlleware, messageRoute)
app.use('/friend', authMidlleware, friendRoute)

// listening on port 8080
server.listen(APP_PORT, () => {
  console.log(`App listening on port ${APP_PORT}`)
})
