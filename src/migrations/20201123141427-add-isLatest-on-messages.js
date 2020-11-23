'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('messages', 'isLatest', Sequelize.BOOLEAN, { after: 'receiver_id' })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('messages', 'isLatest')
  }
}
