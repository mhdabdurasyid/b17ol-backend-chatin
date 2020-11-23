const { Router } = require('express')
const friendController = require('../controllers/friend')

const route = Router()

route.post('/', friendController.addFriend)
route.delete('/:friendId', friendController.deleteFriend)

module.exports = route
