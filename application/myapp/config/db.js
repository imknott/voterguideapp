require('dotenv').config({ path: 'makefile.env' }) // To load environment variables from .env
const { Sequelize } = require('sequelize');

// Initialize Sequelize with MySQL connection using environment variables
const sequelize = new Sequelize(
  process.env.DB_DATABASE, // Database name
  process.env.DB_USER,     // Database username
  process.env.DB_PASSWORD, // Database password
  {
    host: process.env.DB_HOST,     // Hostname
    dialect: 'mysql',              // Using MySQL   // MySQL port, default is 3306
    logging: false,                // Disable logging, can set to true for SQL logging
    pool: {
      max: 5,                      // Maximum number of connections
      min: 0,                      // Minimum number of connections
      acquire: 30000,              // Maximum time (ms) to acquire a connection
      idle: 10000,                 // Maximum time (ms) a connection can be idle
    },
  }
);

  sequelize
  .authenticate()
  .then(async () => {
    console.log('Connection to MySQL has been established successfully.');
  })
  .catch((error) => {
    console.error('Unable to connect to the database:', error);
  });

module.exports = sequelize;
