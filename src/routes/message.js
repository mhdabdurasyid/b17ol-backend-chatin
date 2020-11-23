const { Router } = require('express')
const messageController = require('../controllers/message')

const route = Router()

route.post('/', messageController.createMessage)
route.get('/:friendId', messageController.getMessageDetail)

module.exports = route
