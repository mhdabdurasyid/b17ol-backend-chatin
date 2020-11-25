const responseStandard = require('../helpers/responses')
const Joi = require('joi')
const { Op } = require('sequelize')
const qs = require('querystring')

const { APP_PORT, BASE_URL } = process.env
const { Messages, Users, sequelize } = require('../models')

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
        receiver_id: receiverId,
        isLatest: true
      }

      await Messages.update({ isLatest: false }, {
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
                  sender_id: receiverId
                },
                {
                  receiver_id: receiverId
                }
              ]
            }
          ]
        }
      })

      const result = await Messages.create(data)
      return responseStandard(res, 'Create message successfully', { result: result })
    }
  },
  getMessageDetail: async (req, res) => {
    const { id } = req.user
    const { friendId } = req.params
    let { page } = req.query
    const limit = 20

    if (!page) {
      page = 1
    } else {
      const schema = Joi.object({
        page: Joi.number().integer().min(1)
      })
      const { error, value } = schema.validate({ page: page })
      if (error) {
        return responseStandard(res, error.message, {}, 400, false)
      }
      page = value.page
    }

    const pageInfo = {
      count: 0,
      pages: 0,
      currentPage: page,
      limitPerPage: limit,
      nextLink: null,
      prevLink: null
    }

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
      },
      order: [
        ['createdAt', 'DESC']
      ],
      limit: limit,
      offset: (page - 1) * limit
    })

    if (message.length) {
      const count = await Messages.count({
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
      pageInfo.count = count
      pageInfo.pages = Math.ceil(count / limit)
      const { pages, currentPage } = pageInfo

      if (currentPage < pages) {
        pageInfo.nextLink = `${BASE_URL}:${APP_PORT}/message/${friendId}?${qs.stringify({ ...req.query, ...{ page: page + 1 } })}`
      }

      if (currentPage > 1) {
        pageInfo.prevLink = `${BASE_URL}:${APP_PORT}/message/${friendId}?${qs.stringify({ ...req.query, ...{ page: page - 1 } })}`
      }

      const user = await Users.findByPk(friendId, { attributes: ['id', 'name'] })
      return responseStandard(res, 'Found message detail!', { pageInfo, result: { friend: user, message } })
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

    if (isDeleted > 0) {
      return responseStandard(res, 'Delete message successfully!', {})
    } else {
      return responseStandard(res, 'Delete message failed!', {}, 400, false)
    }
  },
  getMessageList: async (req, res) => {
    const { id } = req.user
    let { page } = req.query
    const limit = 20

    if (!page) {
      page = 1
    } else {
      const schema = Joi.object({
        page: Joi.number().integer().min(1)
      })
      const { error, value } = schema.validate({ page: page })
      if (error) {
        return responseStandard(res, error.message, {}, 400, false)
      }
      page = value.page
    }

    const pageInfo = {
      count: 0,
      pages: 0,
      currentPage: page,
      limitPerPage: limit,
      nextLink: null,
      prevLink: null
    }

    const message = await Messages.findAll({
      attributes: {
        include: [
          [
            sequelize.literal('(SELECT name from users WHERE users.id = messages.sender_id)'),
            'sender_name'
          ],
          [
            sequelize.literal('(SELECT photo from users WHERE users.id = messages.sender_id)'),
            'sender_photo'
          ],
          [
            sequelize.literal('(SELECT name from users WHERE users.id = messages.receiver_id)'),
            'receiver_name'
          ],
          [
            sequelize.literal('(SELECT photo from users WHERE users.id = messages.receiver_id)'),
            'receiver_photo'
          ]
        ]
      },
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
          { isLatest: true }
        ]
      },
      order: [
        ['createdAt', 'DESC']
      ],
      limit: limit,
      offset: (page - 1) * limit
    })

    if (message.length) {
      const count = await Messages.count({
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
            { isLatest: true }
          ]
        }
      })
      pageInfo.count = count
      pageInfo.pages = Math.ceil(count / limit)
      const { pages, currentPage } = pageInfo

      if (currentPage < pages) {
        pageInfo.nextLink = `${BASE_URL}:${APP_PORT}/message?${qs.stringify({ ...req.query, ...{ page: page + 1 } })}`
      }

      if (currentPage > 1) {
        pageInfo.prevLink = `${BASE_URL}:${APP_PORT}/message?${qs.stringify({ ...req.query, ...{ page: page - 1 } })}`
      }

      return responseStandard(res, 'Found message list!', { pageInfo, result: message })
    } else {
      return responseStandard(res, 'Message list not found!', {}, 404, false)
    }
  }
}
