// models/SearchHistory.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); 

const SearchHistory = sequelize.define('SearchHistory', {
    search_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'User',
            key: 'user_id',
        }
    },
    search_query: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    timestamp: { // ASK IAN ABOUT THIS AGAIN
        type: DataTypes.TIME,
        defaultValue: DataTypes.NOW,
    },
}, {
    timestamps: false,
});

SearchHistory.associate = (models) => {
    SearchHistory.belongsTo(models.User, {foreignKey: 'user_id'});
};

module.exports = SearchHistory;