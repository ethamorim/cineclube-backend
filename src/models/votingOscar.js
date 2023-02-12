const { DataTypes } = require('sequelize');
const { db } = require('../database/connection');

const VotingOscar = db.define('VotingOscar', {});

VotingOscar.associate = (models) => {
  VotingOscar.belongsTo(models.User);
  VotingOscar.belongsTo(models.NomineeOscar);
};

module.require = VotingOscar;
