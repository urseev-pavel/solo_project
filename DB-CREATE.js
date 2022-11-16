// !!! Создание БД !!!

// ! Install Sequelize and Postgres
// * npm i pg pg-hstore sequelize sequelize-cli

// ! Create ".sequelizerc"
// require('dotenv').config();
// const path = require('path');

// module.exports = {
//   config: path.resolve('db', 'config', 'config.json'),
//   'models-path': path.resolve('db', 'models'),
//   'seeders-path': path.resolve('db', 'seeders'),
//   'migrations-path': path.resolve('db', 'migrations'),
// };

// ! Sequelize initialization
// * npx sequelize-cli init

// ! Edit "db/config/database.json"
// "development": {
//   "use_env_variable": "DB_URL"
// },

// ! Edit ".env" file
// * DB_URL=postgresql://[user[:password]@][netlocation][:port][/dbname]
// DB_URL=postgres://super_user:123@localhost:5432/solo_project

// ! Create database
// * npx sequelize-cli db:create

// ! Create models
// * npx sequelize-cli model:generate --name User --attributes name:string,email:string,password:string

// ! Migrate all
// * npx sequelize-cli db:migrate

// !!! Работаем с БД !!!

require('dotenv').config(); // ! Нужно для запуска БД при использовании "use_env_variable" в "db/config/database.json"

const { sequelize } = require('./db/models');

const dbConnectCheck = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database online!');
  } catch (error) {
    console.log('Unable to connect to the database:', error);
  }
};
dbConnectCheck();
