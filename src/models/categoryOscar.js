const { DataTypes } = require('sequelize');
const { db } = require('../database/connection');

const CategoryOscar = db.define('CategoryOscar', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  previousCategory: {
    type: DataTypes.STRING
  },
  nextCategory: {
    type: DataTypes.STRING
  }
});

CategoryOscar.associate = (models) => {
  CategoryOscar.hasMany(models.NomineeOscar);
};

module.exports = CategoryOscar;
