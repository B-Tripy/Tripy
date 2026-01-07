const Sequelize = require("sequelize");
module.exports = class Emotions extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        category: {
          type: Sequelize.STRING(2),
          allowNull: false,
        },
        satisfaction: {
          type: Sequelize.STRING(1),
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
        modelName: "Emotion",
        paranoid: false,
        charset: "utf8",
        collate: "utf8_general_ci",
      }
    );
  }
  static associate(db) {
    db.Emotion.belongsTo(db.Trip);
    db.Emotion.belongsTo(db.Photo);
  }
};
