const Sequelize = require("sequelize");
module.exports = class Posts extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        post: {
          type: Sequelize.TEXT,
          allowNull: false,
        },
        points: {
          type: Sequelize.INTEGER,
          defaultValue: 0,
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
        modelName: "Post",
        paranoid: false,
        charset: "utf8",
        collate: "utf8_general_ci",
      }
    );
  }
  static associate(db) {
    db.Post.belongsTo(db.Photo);
    db.Post.belongsTo(db.User);
  }
};
