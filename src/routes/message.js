const { Router } = require('express')
const messageController = require('../controllers/message')

const route = Router()
route.post('/', messageController.createMessage)

module.exports = route
