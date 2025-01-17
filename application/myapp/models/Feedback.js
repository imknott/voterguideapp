// models/Feedback.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); 

const Feedback = sequelize.define('Feedback', {
    feedback_id: {
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
    candidate_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'CandidateInfo',
            key: 'candidate_id',
        }
    },
    comment: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    rating: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
}, {
    timestamps: false,
});

module.exports = Feedback;