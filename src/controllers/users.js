const responseStandard = require('../helpers/responses')
const Joi = require('joi')

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
  }
}
