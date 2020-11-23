const responseStandard = require('../helpers/responses')
const Joi = require('joi')
const bcrypt = require('bcryptjs')
const upload = require('../helpers/upload')

const { Users } = require('../models')

module.exports = {
  getUserProfile: async (req, res) => {
    const { id } = req.user
    const user = await Users.findByPk(id)

    if (user) {
      return responseStandard(res, 'Found an user!', { result: user })
    } else {
      return responseStandard(res, 'User not found!', {}, 404, false)
    }
  },
  getUserDetailById: async (req, res) => {
    const { id } = req.params
    const user = await Users.findByPk(id)

    if (user) {
      return responseStandard(res, 'Found an user!', { result: user })
    } else {
      return responseStandard(res, 'User not found!', {}, 404, false)
    }
  },
  searchUser: async (req, res) => {
    const schema = Joi.object({
      userId: Joi.string().max(20).required()
    })

    const { error, value } = schema.validate(req.body)

    if (error) {
      return responseStandard(res, error.message, {}, 400, false)
    } else {
      const { userId } = value
      const user = await Users.findAll({ where: { user_id: userId } })

      if (user.length) {
        return responseStandard(res, 'Found users!', { result: user })
      } else {
        return responseStandard(res, 'User not found!', {}, 404, false)
      }
    }
  },
  updatePassword: async (req, res) => {
    const { id } = req.user
    const schema = Joi.object({
      newPassword: Joi.string().min(6).max(20).required(),
      confirmPassword: Joi.ref('newPassword')
    })

    const { error, value } = schema.validate(req.body)

    if (error) {
      return responseStandard(res, error.message, {}, 400, false)
    } else {
      const { newPassword } = value
      const salt = bcrypt.genSaltSync(10)
      const hashedPassword = bcrypt.hashSync(newPassword, salt)

      const isUpdate = await Users.update({ password: hashedPassword }, { where: { id } })

      if (isUpdate[0] === 1) {
        return responseStandard(res, 'Update password successfully!', {})
      } else {
        return responseStandard(res, 'Update password failed!', {}, 400, false)
      }
    }
  },
  updateProfile: async (req, res) => {
    const { id } = req.user
    const uploadImage = upload.single('image')

    const schema = Joi.object({
      phoneNumber: Joi.string().min(10).max(12),
      email: Joi.string().email().max(50),
      name: Joi.string().max(20),
      status: Joi.string().max(500),
      userId: Joi.string().max(20)
    })

    uploadImage(req, res, async (err) => {
      if (err) {
        return responseStandard(res, err.message, {}, 400, false)
      } else {
        const image = req.file
        const { error, value } = schema.validate(req.body)
        const { phoneNumber, email, name, status, userId } = value

        if (error) {
          return responseStandard(res, error.message, {}, 400, false)
        } else {
          await Users.update({
            phone_number: phoneNumber,
            email,
            name,
            status,
            user_id: userId,
            photo: image && `/uploads/${image.filename}`
          }, {
            where: {
              id
            }
          })

          return responseStandard(res, 'Update profile successfully!', {})
        }
      }
    })
  }
}
