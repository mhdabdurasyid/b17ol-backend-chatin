const { Router } = require('express')
const messageController = require('../controllers/message')

const route = Router()

route.post('/', messageController.createMessage)
route.get('/:friendId', messageController.getMessageDetail)
route.delete('/:friendId', messageController.deleteMessage)
route.get('/', messageController.getMessageList)

module.exports = route
