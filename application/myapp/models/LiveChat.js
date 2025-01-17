module.exports = (sequelize, DataTypes) => {
    const LiveChat = sequelize.define("LiveChat", {
      // Define columns for the LiveChat table
      LiveChat_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      Candidate_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Candidates', // Assuming you have a Candidates table
          key: 'Candidate_id',
        },
      },
      User_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Users', // Assuming you have a Users table
          key: 'User_id',
        },
      },
      Comment: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      Timestamp: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false,
      },
    });

  
    return LiveChat;
  };
  