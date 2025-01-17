const fs = require('fs');
const path = require('path');
const sequelize = require('../config/db'); // Import the Sequelize instance
const { DataTypes } = require('sequelize');

// Read model files
const models = {};

// Automatically import all model files
fs.readdirSync(__dirname)
  .filter(file => file.endsWith('.js') && file !== 'relationshipdefine.js')
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, DataTypes);
    models[model.name] = model;
  });

// Associate models (if any)
Object.keys(models).forEach(modelName => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

// Export the models and sequelize instance
module.exports = { 
    sequelize,
    ...models 
};