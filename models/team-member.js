const uuid = require('uuid');

module.exports = function(sequelize, DataTypes) {
    const TeamMember = sequelize.define("TeamMember", {
        uuid: {
          primaryKey: true,
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV1
        },
        Name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [1]
            }
        },
        TeamName: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [1]
            }
        },
        EmailAddress: {
            type: DataTypes.STRING,
            allowNull: true
          },
        PhoneNumber: {
          type: DataTypes.STRING,
          allowNull: false,
          validate: {
            len: [1]
          }
        },
        Amount: {
          type: DataTypes.STRING,
          allowNull: false,
          defaultValue: 0
        }
    });

    return TeamMember;
  };