const Sequelize = require("sequelize")
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
      },
      {
        sequelize,
        timestamps: true,
        underscored: false,
        createdAt: true,
        updatedAt: false,
        modelName: "Emotions",
        tableName: "emotions",
        paranoid: false,
        charset: "utf8",
        collate: "utf8_general_ci",
      }
    )
  }
  static associate(db) {
    db.Emotions.belongsTo(db.Trips)
    db.Emotions.belongsTo(db.Photos)
  }
}
