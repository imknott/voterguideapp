// models/Message.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); 

const Message = sequelize.define('Message', {
    message_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
    },
    sender_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'User',
            key: 'user_id',
        }
    },
    receiver_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'User',
            key: 'user_id',
        }
    },
    content: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    sent_at: { // ASK IAN ABOUT THIS AGAIN
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
}, {
    timestamps: false,
});

module.exports = Message;