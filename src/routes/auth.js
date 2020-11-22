const { Router } = require('express')
const authController = require('../controllers/auth')

const route = Router()

route.post('/register', authController.register)
route.post('/isPhoneRegister', authController.isPhoneRegister)
route.post('/isEmailValid', authController.isEmailValid)
route.post('/resetPassword/:id', authController.resetPassword)
route.post('/loginByEmail', authController.loginByEmail)
route.post('/loginByPhone', authController.loginByPhone)

module.exports = route
