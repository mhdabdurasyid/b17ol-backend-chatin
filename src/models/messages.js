'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Messages extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
      // define association here
    }
  };
  Messages.init({
    message: DataTypes.STRING,
    sender_id: DataTypes.INTEGER,
    receiver_id: DataTypes.INTEGER,
    isLatest: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Messages'
  })
  return Messages
}
