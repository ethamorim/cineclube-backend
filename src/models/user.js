const { DataTypes } = require('sequelize');
const { db } = require('../database/connection');

const User = db.define('User', {
  user: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  }
});

module.exports = User;
