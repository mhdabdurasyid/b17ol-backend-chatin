const { Router } = require('express')
const friendController = require('../controllers/friend')

const route = Router()

route.post('/', friendController.addFriend)
route.delete('/:friendId', friendController.deleteFriend)
route.get('/', friendController.getFriendList)

module.exports = route
