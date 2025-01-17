// models/PoliticalParty.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); 

const PoliticalParty = sequelize.define('PoliticalParty', {
    Party_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
    },
    Party_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    Leader: { // ASK IAN HERE ABOUT IF THIS SHOULD BE STRING OR REFERENCE
        type: DataTypes.STRING,
        allowNull: false,
    },
    Founded_date: {
        type: DataTypes.DATE,
        allowNull: false,
    }
}, {
    timestamps: false,
});

module.exports = PoliticalParty;