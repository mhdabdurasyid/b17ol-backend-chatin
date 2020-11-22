const { Router } = require('express')
const authController = require('../controllers/auth')

const route = Router()

route.post('/register', authController.register)
route.post('/isPhoneRegister', authController.isPhoneRegister)
route.post('/isEmailValid', authController.isEmailValid)

module.exports = route
