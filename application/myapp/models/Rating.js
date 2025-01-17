// models/Rating.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); 

const Rating = sequelize.define('Rating', {
    rating_id: {
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
            model: 'CandidatesInfo',
            key: 'candidate_id',
        }
    },
    rating_value: {
        type: DataTypes.INTEGER,
        allowNull: false,
    }
}, {
    timestamps: false,
});

module.exports = Rating;