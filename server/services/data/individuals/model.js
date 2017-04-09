'use strict'

const Sequelize = require('sequelize')

module.exports = function (app) {
  const Individual = app.sequelize.define('Individual', {
    id: {
      type: Sequelize.STRING,
      primaryKey: true,
      unique: true,
      defaultValue: Sequelize.UUIDV4
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        isEmail: true
      }
    }
  }, {
    timestamps: true,
    paranoid: true,
    underscored: false,
    freezeTableName: true,
    tableName: 'individuals'
  })
  Individual.sync({force: app.get('postgres').force})
  return Individual
}