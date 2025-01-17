// models/PollingStation.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); 

const PollingStation = sequelize.define('PollingStation', {
    station_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
    },
    location: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    election_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        reference: {
            model: 'ElectionInfo',
            key: 'election_id',
        }
    },
    poll_hours: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    timestamps: false,
});

module.exports = PollingStation;