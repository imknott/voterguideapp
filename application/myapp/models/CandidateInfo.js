const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const CandidateInfo = sequelize.define('CandidateInfo', {
    Candidate_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    Name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    Photo: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    Policies: {
        type: DataTypes.TEXT, // Use TEXT for potentially longer descriptions
        allowNull: false,
    },
    Background: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    Location: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    timestamps: false,
});

// Define association if needed
CandidateInfo.associate = (models) => {
    CandidateInfo.hasMany(models.CandidatePolicy, {
        foreignKey: 'Candidate_id', // Ensure this matches the foreign key in CandidatePolicy
        as: 'policies', // This should match the alias used in the controller
    });
};

module.exports = CandidateInfo;
