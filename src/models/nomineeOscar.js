const { DataTypes } = require('sequelize');
const { db } = require('../database/connection');

const CategoryOscar = require('./categoryOscar');
const User = require('./user');

const NomineeOscar = db.define('NomineeOscar', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  nominated: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  film: {
    type: DataTypes.STRING,
    allowNull: false,
  }
});
NomineeOscar.belongsTo(CategoryOscar);
NomineeOscar.belongsToMany(User, { through: 'VotingOscar' });

module.exports = NomineeOscar;
