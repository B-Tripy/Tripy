const Sequelize = require("sequelize");
module.exports = class Bookmarks extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        location: { type: Sequelize.STRING(100), allowNull: false },
        description: { type: Sequelize.TEXT, allowNull: true },
      },
      {
        sequelize,
        underscored: false,
        modelName: "Bookmark",
        createdAt: false,
        updatedAt: false,
        paranoid: false,
        charset: "utf8",
        collate: "utf8_general_ci",
      }
    );
  }
  static associate(db) {
    db.Bookmark.belongsTo(db.User);
  }
};
