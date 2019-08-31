module.exports = function(sequelize, DataTypes) {
    const TeamMember = sequelize.define("TeamMember", {
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
          validate: {
            len: [1]
          }
        }
    });
    return TeamMember;
  };