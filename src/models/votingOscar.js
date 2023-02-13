const { db } = require('../database/connection');

const VotingOscar = db.define('VotingOscar', {});

VotingOscar.associate = (models) => {
  VotingOscar.belongsTo(models.User, {
    foreignKey: 'user'
  });
  VotingOscar.belongsTo(models.NomineeOscar, {
    foreignKey: 'nomineeId'
  });
  VotingOscar.belongsTo(models.CategoryOscar, {
    foreignKey: 'categoryId'
  });
};

module.exports = VotingOscar;
