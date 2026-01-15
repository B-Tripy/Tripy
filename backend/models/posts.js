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
    
      },
      {
        sequelize,
        timestamps: true,
        underscored: false,
        createdAt: true,
        updatedAt: false,
        modelName: "Posts",
        paranoid: false,
        charset: "utf8",
        collate: "utf8_general_ci",
      }
    );
  }
  static associate(db) {
    db.Posts.belongsTo(db.Photos);
    db.Posts.belongsTo(db.Users);
  }
};
