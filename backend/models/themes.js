const Sequelize = require("sequelize");
module.exports = class Themes extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        themecode: {
          type: Sequelize.STRING(2),
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
        modelName: "Themes",
        paranoid: false,
        charset: "utf8",
        collate: "utf8_general_ci",
      }
    );
  }
  static associate(db) {
    db.Themes.belongsTo(db.Trips);
  }
};
