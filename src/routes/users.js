const { Router } = require('express')
const usersController = require('../controllers/users')

const route = Router()

route.get('/', usersController.getUserProfile)
route.get('/:id', usersController.getUserDetailById)
route.post('/search', usersController.searchUser)
route.post('/updatePassword', usersController.updatePassword)

module.exports = route
