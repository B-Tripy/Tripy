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
        search: {
          type: Sequelize.TINYINT,
          allowNull: false,
          defaultValue: false,
        },
        createdAt: {
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
        modelName: "Users",
        paranoid: false,
        charset: "utf8",
        collate: "utf8_general_ci",
      }
    );
  }
  static associate(db) {
    db.Users.hasMany(db.UserTrips,{foreignKey:'UserId'})
    db.Users.hasMany(db.Posts);
    db.Users.hasMany(db.Photos);
    db.Users.hasMany(db.Bookmarks);
  }
};
