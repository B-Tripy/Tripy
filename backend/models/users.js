const Sequelize = require("sequelize");
module.exports = class Users extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        nickname: {
          type: Sequelize.STRING(50),
          allowNull: false,
        },
        email: {
          type: Sequelize.STRING(150),
          allowNull: false,
          unique: true,
        },
        password: {
          type: Sequelize.STRING(200),
          allowNull: false,
        },
        createdAt: {
          type: Sequelize.DATE,
          defaultValue: Sequelize.NOW,
        },
        updatedAt: {
          type: Sequelize.DATE,
          defaultValue: Sequelize.NOW,
        },
      },
      {
        sequelize,
        timestamps: true,
        underscored: false,
        modelName: "User",
        paranoid: false,
        charset: "utf8",
        collate: "utf8_general_ci",
      }
    );
  }
  static associate(db) {
    db.User.belongsToMany(db.Trip, { through: "UserTrip" });
    db.User.hasMany(db.Post);
    db.User.hasMany(db.Photo);
  }
};
