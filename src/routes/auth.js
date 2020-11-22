const { Router } = require('express')
const authController = require('../controllers/auth')

const route = Router()

route.post('/register', authController.register)

module.exports = route
