const { DataTypes } = require('sequelize');
const { db } = require('../database/connection');

const NomineeOscar = require('./nomineeOscar');

const User = db.define('User', {
  user: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  }
});
User.belongsToMany(NomineeOscar, { through: 'VotingOscar' });

module.exports = User;
