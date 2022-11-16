const { sequelize } = require('./models');

module.exports = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database online!');
  } catch (error) {
    console.log('Unable to connect to the database:', error);
  }
};
