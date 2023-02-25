const { DataTypes } = require('sequelize');
const { db } = require('../database/connection');

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
  },
  image: {
    type: DataTypes.STRING
  }
});

NomineeOscar.associate = (models) => {
  NomineeOscar.belongsTo(models.CategoryOscar);
};

module.exports = NomineeOscar;
