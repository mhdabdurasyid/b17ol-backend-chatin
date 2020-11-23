const responseStandard = require('../helpers/responses')
const Joi = require('joi')
const { Op } = require('sequelize')

const { Messages, Users } = require('../models')

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
  },
  getMessageDetail: async (req, res) => {
    const { id } = req.user
    const { friendId } = req.params

    const message = await Messages.findAll({
      where: {
        [Op.and]: [
          {
            [Op.or]: [
              {
                sender_id: id
              },
              {
                receiver_id: id
              }
            ]
          },
          {
            [Op.or]: [
              {
                sender_id: friendId
              },
              {
                receiver_id: friendId
              }
            ]
          }
        ]
      }
    })

    if (message.length) {
      const user = await Users.findByPk(friendId, { attributes: ['id', 'name'] })
      return responseStandard(res, 'Found message detail!', { result: { friend: user, message } })
    } else {
      return responseStandard(res, 'Message not found!', {}, 404, false)
    }
  },
  deleteMessage: async (req, res) => {
    const { id } = req.user
    const { friendId } = req.params

    const isDeleted = await Messages.destroy({
      where: {
        [Op.and]: [
          {
            [Op.or]: [
              {
                sender_id: id
              },
              {
                receiver_id: id
              }
            ]
          },
          {
            [Op.or]: [
              {
                sender_id: friendId
              },
              {
                receiver_id: friendId
              }
            ]
          }
        ]
      }
    })

    if (isDeleted === 1) {
      return responseStandard(res, 'Delete message successfully!', {})
    } else {
      return responseStandard(res, 'Delete message failed!', {}, 400, false)
    }
  }
}
