const Sequelize = require("sequelize")
module.exports = class UserTrips extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        Owner: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: false,
        },
      },
      {
        sequelize,
        timestamps: true,
        underscored: false,
        createdAt: false,
        updatedAt: false,
<<<<<<< HEAD
        modelName: "UserTrips",
=======
        modelName: "UserTrip",
>>>>>>> hdy
        tableName: "usertrip",
        paranoid: false,
        charset: "utf8",
        collate: "utf8_general_ci",
<<<<<<< HEAD
      },
    );
  }
  static associate(db) {
    db.UserTrips.belongsTo(db.Users, {
      foreignKey: "userId",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
    db.UserTrips.belongsTo(db.Trips, {
      foreignKey: "tripId",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
=======
      }
    )
  }
  static associate(db) {
    db.UserTrip.belongsTo(db.Users, { foreignKey: "UserId" })
    db.UserTrip.belongsTo(db.Trips, { foreignKey: "TripId" })
>>>>>>> hdy
  }
}
