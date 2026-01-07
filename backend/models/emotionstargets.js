const Sequelize = require("sequelize");
module.exports = class EmotionsTargets extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        satisfaction: {
          //만족여부
          type: Sequelize.STRING(1),
          allowNull: false,
        },
        target: {
          type: Sequelize.STRING(100),
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
        modelName: "EmotionsTarget",
        paranoid: false,
        charset: "utf8",
        collate: "utf8_general_ci",
      }
    );
  }
  static associate(db) {
    db.EmotionsTarget.belongsTo(db.Trip);
    db.EmotionsTarget.belongsTo(db.Photo);
  }
};
