// models/CandidateEvent.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); 

const CandidateEvent = sequelize.define('CandidateEvent', {
    event_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
    },
    candidate_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'CandidateInfo',
            key: 'candidate_id',
        }
    },
    event_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    location: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    date: { // ASK IAN ABOUT THIS AGAIN
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
}, {
    timestamps: false,
});

module.exports = CandidateEvent;