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
    individual: {
      type: Sequelize.STRING,
      allowNull: false
    },
    campaign: {
      type: Sequelize.STRING,
      allowNull: false
    },
    charity: {
      type: Sequelize.STRING,
      allowNull: true
    },
    company: {
      type: Sequelize.STRING,
      allowNull: false
    }
  }, {
    timestamps: true,
    paranoid: true,
    underscored: false,
    freezeTableName: true,
    tableName: 'surveys'
  })
  Survey.sync({force: app.get('postgres').force})
  return Survey
}
