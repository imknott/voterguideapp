const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // Import sequelize instance

const User = sequelize.define('User', {
  user_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
  },
  name: DataTypes.STRING,
  dob: DataTypes.DATE,
  address: DataTypes.STRING,
}, {
  timestamps: false
});

User.associate = (models) => {
  User.hasOne(models.RegisteredUser, { foreignKey: 'user_id', onDelete: 'CASCADE' });
};

User.associate = (models) => {
  User.hasMany(models.SearchHistory, { foreignKey: 'user_id', onDelete: 'CASCADE' });
};

module.exports = User;