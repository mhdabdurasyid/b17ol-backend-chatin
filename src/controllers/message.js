const responseStandard = require('../helpers/responses')
const Joi = require('joi')

const { Messages } = require('../models')

module.exports = {
  createMessage: async (req, res) => {
    const { id } = req.user
    const schema = Joi.object({
      message: Joi.string().max(1000).required(),
      receiverId: Joi.number().max(11).required()
    })

    const { error, value } = schema.validate(req.body)

    if (error) {
      return responseStandard(res, error.message, {}, 400, false)
    } else {
      const { message, receiverId } = value

      const data = {
        message,
        sender_id: id,
        receiver_id: receiverId
      }

      const result = await Messages.create(data)
      return responseStandard(res, 'Create message successfully', { result: result })
    }
  }
}
