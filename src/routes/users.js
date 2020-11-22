const { Router } = require('express')
const authController = require('../controllers/users')

const route = Router()

route.get('/', authController.getUserProfile)
route.get('/:id', authController.getUserDetailById)

module.exports = route
