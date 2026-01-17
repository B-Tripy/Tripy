const Sequelize = require("sequelize");
module.exports = class Trips extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        title: {
          type: Sequelize.STRING(50),
          allowNull: false,
        },
        description: {
          type: Sequelize.STRING(250),
          allowNull: true,
        },
        plan: {
          type: Sequelize.TEXT,
          allowNull: false,
        },
        score: {
          type: Sequelize.INTEGER,
          defaultValue: 0,
        },
        createdAt: {
          type: Sequelize.DATE,
          defaultValue: Sequelize.NOW,
        },
        start_date: {
          type: Sequelize.DATE,
          defaultValue: Sequelize.NOW,
        },
        end_date: {
          type: Sequelize.DATE,
          defaultValue: Sequelize.NOW,
        },
      },
      {
        sequelize,
        timestamps: true,
        underscored: false,
        createdAt: true,
        updatedAt: false,
        modelName: "Trip",
        paranoid: false,
        charset: "utf8",
        collate: "utf8_general_ci",
      },
    );
  }
  static associate(db) {
    db.Trips.hasMany(db.Photos);
    db.Trips.hasMany(db.EmotionsTargets);
    db.Trips.belongsToMany(db.Users, {
      through: usertrip,
      foreignKey: "tripId",
      otherKey: "userId",
    });
    db.Trips.hasMany(usertrips, { foreignKey: "tripId" });
    db.Trips.hasMany(db.Themes);
  }
};
