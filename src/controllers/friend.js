const responseStandard = require('../helpers/responses')
const Joi = require('joi')

const { Friends } = require('../models')

module.exports = {
  addFriend: async (req, res) => {
    const { id } = req.user
    const schema = Joi.object({
      friendId: Joi.number().max(11).required()
    })

    const { error, value } = schema.validate(req.body)

    if (error) {
      return responseStandard(res, error.message, {}, 400, false)
    } else {
      const { friendId } = value
      const data = {
        id,
        friend: friendId
      }

      try {
        const result = await Friends.create(data)
        return responseStandard(res, 'Add friend successfully', { result: result })
      } catch (e) {
        return responseStandard(res, 'Friend already exist', {}, 500, false)
      }
    }
  }
}
