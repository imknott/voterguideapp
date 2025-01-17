// models/CandidatePolicy.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); 

const CandidatePolicy = sequelize.define('CandidatePolicy', {
    policy_id: {
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
    policy_description: {
        type: DataTypes.STRING,
        allowNull: false,
    }
}, {
    timestamps: false,
});

// Define associations
CandidatePolicy.associate = (models) => {
    CandidatePolicy.belongsTo(models.CandidateInfo, {
        foreignKey: 'candidate_id',
    });
};


module.exports = CandidatePolicy;