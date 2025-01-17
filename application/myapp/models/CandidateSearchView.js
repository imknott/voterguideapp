const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // adjust path as needed

const CandidateSearchView = sequelize.define('CandidateSearchView', {
    Candidate_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
    },
    Name: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    Photo: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    Location: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    Policy_description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    Event_name: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    event_location: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    Party_name: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    party_leader: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    Rating_value: {
        type: DataTypes.INTEGER,
        allowNull: true,
    }
}, {
    tableName: 'CandidateSearchView',
    timestamps: false,
    freezeTableName: true,
});

module.exports = CandidateSearchView;
