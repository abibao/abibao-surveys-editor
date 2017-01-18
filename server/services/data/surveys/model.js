'use strict'

const Sequelize = require('sequelize')

module.exports = function (app) {
  const Survey = app.sequelize.define('Survey', {
    id: {
      type: Sequelize.STRING,
      primaryKey: true,
      unique: true,
      defaultValue: Sequelize.UUIDV4
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
    tableName: 'surveys'
  })
  Survey.sync()
  return Survey
}
