const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

  const RegisteredUser = sequelize.define('RegisteredUser', {
      user_id: {
          type: DataTypes.INTEGER,
          primaryKey: true,  // Same primary key as User
          references: {
              model: 'Users', // Table name for User model
              key: 'user_id'
          }
      },
      email: {
          type: DataTypes.STRING,
          unique: true,
          allowNull: false
      },
      password: {
          type: DataTypes.STRING,
          allowNull: false
      },
      dob: DataTypes.DATE,
      age: DataTypes.INTEGER,
      username: {
          type: DataTypes.STRING,
          unique: true,
          allowNull: false
      }
  }, {
      timestamps: false
  });

  RegisteredUser.associate = (models) => {
      RegisteredUser.belongsTo(models.User, { foreignKey: 'user_id', onDelete: 'CASCADE' });
  };

  module.exports = RegisteredUser;
