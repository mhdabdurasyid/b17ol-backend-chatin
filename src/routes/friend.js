const { Router } = require('express')
const friendController = require('../controllers/friend')

const route = Router()

route.post('/', friendController.addFriend)

module.exports = route
