const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(process.env.DB_CONNECTION_URI, {
  dialect: 'postgres'
});

exports.connect = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully');

    await sequelize.sync();
  } catch (error) {
    console.log('Unable to connect to database:', error);
  }
};
exports.db = sequelize;
