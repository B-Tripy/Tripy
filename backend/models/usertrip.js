const Sequelize = require("sequelize");
module.exports = class UserTrips extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        OwnerId: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
      },
      {
        sequelize,
        timestamps: true,
        underscored: false,
        createdAt: false,
        updatedAt: false,
        modelName: "UserTrip",
        tableName: "UserTrip",
        paranoid: false,
        charset: "utf8",
        collate: "utf8_general_ci",
      }
    );
  }
  static associate(db) {
    db.UserTrip.belongsTo(db.User, { foreignKey: "UserId" });
    db.UserTrip.belongsTo(db.Trip, { foreignKey: "TripId" });
  }
};
