// models/VoterPreference.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); 

const VoterPreference = sequelize.define('VoterPreference', {
    preference_id: {
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
    issue_id: { // ASK IAN WHAT THIS SHOULD REFERENCE IE ARE WE MAKING SOME TAG SYSTEM HERE OR SM
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: '',
            key: '',
        }
    },
    candidate_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'CandidatesInfo',
            key: 'candidate_id',
        }
    }
}, {
    timestamps: false,
});

module.exports = VoterPreference;