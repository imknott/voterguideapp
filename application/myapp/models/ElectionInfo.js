// models/ElectionInfo.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const ElectionInfo = sequelize.define('ElectionInfo', {
    election_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    date: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    location: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    desctiption: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    timestamps: false,
});

module.exports = ElectionInfo;