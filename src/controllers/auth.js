const responseStandard = require('../helpers/responses')
const upload = require('../helpers/upload')
const bcrypt = require('bcryptjs')
const Joi = require('joi')

const { Users } = require('../models')

module.exports = {
  register: async (req, res) => {
    const uploadImage = upload.single('image')

    const schema = Joi.object({
      phoneNumber: Joi.string().min(10).max(12).required(),
      name: Joi.string().max(20).required(),
      password: Joi.string().min(6).max(20).required(),
      confirmPassword: Joi.ref('password')
    })

    uploadImage(req, res, async (err) => {
      if (err) {
        return responseStandard(res, err.message, {}, 400, false)
      } else {
        const image = req.file
        const { error, value } = schema.validate(req.body)

        if (error) {
          return responseStandard(res, error.message, {}, 400, false)
        } else {
          const { phoneNumber, name, password } = value
          const salt = bcrypt.genSaltSync(10)
          const hashedPassword = bcrypt.hashSync(password, salt)

          const data = {
            phone_number: phoneNumber,
            name,
            password: hashedPassword,
            photo: image && `/uploads/${image.filename}`
          }

          const result = await Users.create(data)
          return responseStandard(res, 'Register user successfully', { result: result })
        }
      }
    })
  },
  isPhoneRegister: async (req, res) => {
    const schema = Joi.object({
      phoneNumber: Joi.string().min(10).max(12).required()
    })

    const { error, value } = schema.validate(req.body)

    if (error) {
      return responseStandard(res, error.message, {}, 400, false)
    } else {
      const { phoneNumber } = value
      const user = await Users.findOne({
        attributes: ['id', 'phone_number'],
        where: { phone_number: phoneNumber }
      })

      if (user) {
        return responseStandard(res, 'Found an phone number!', { result: user })
      } else {
        return responseStandard(res, 'Phone number not found!', {}, 404, false)
      }
    }
  }
}
