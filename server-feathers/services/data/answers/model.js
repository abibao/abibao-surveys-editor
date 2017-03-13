'use strict'

const Sequelize = require('sequelize')

module.exports = function (app) {
  const Answer = app.sequelize.define('Answer', {
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
    },
    campaign: {
      type: Sequelize.STRING,
      allowNull: false
    },
    campaign_name: {
      type: Sequelize.STRING,
      allowNull: false
    },
    charity_id: {
      type: Sequelize.STRING,
      allowNull: true
    },
    charity_name: {
      type: Sequelize.STRING,
      allowNull: true
    },
    answer: {
      type: Sequelize.STRING,
      allowNull: false
    },
    answer_text: {
      type: Sequelize.STRING,
      allowNull: false
    }
  }, {
    timestamps: true,
    paranoid: true,
    underscored: false,
    freezeTableName: true,
    tableName: 'answers'
  })
  Answer.sync({force: app.get('force')})
  return Answer
}