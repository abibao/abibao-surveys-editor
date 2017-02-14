'use strict'

const Sequelize = require('sequelize')

module.exports = function (app) {
  const Campaign = app.sequelize.define('Campaign', {
    id: {
      type: Sequelize.STRING,
      primaryKey: true,
      unique: true,
      defaultValue: Sequelize.UUIDV4
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false
    },
    picture: {
      type: Sequelize.STRING,
      allowNull: false
    },
    data: {
      type: Sequelize.JSON,
      allowNull: false
    }
  }, {
    timestamps: true,
    paranoid: true,
    underscored: false,
    freezeTableName: true,
    tableName: 'campaigns'
  })
  Campaign.sync()
  return Campaign
}
