const { Sequelize } = require('sequelize');
const path = require('path');
const fs = require('fs');

const sequelize = new Sequelize(process.env.DB_CONNECTION_URI, {
  dialect: 'postgres'
});

exports.connect = async () => {
  const db = {};
  const models = path.join(__dirname, '../models');

  fs.readdirSync(models)
    .filter((file) => {
      return (file.indexOf('.') !== 0) && (file.slice(-3) === '.js');
    })
    .forEach((file) => {
      const model = require(path.join(models, file));
      db[model.name] = model;
    });

  Object.keys(db).forEach((modelName) => {
    if (db[modelName].associate) {
      db[modelName].associate(db);
    }
  });

  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully');

    await sequelize.sync();
  } catch (error) {
    console.log('Unable to connect to database:', error);
  }
};
exports.db = sequelize;
