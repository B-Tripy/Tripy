const Sequelize = require("sequelize");
module.exports = class Destinations extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        no: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        name: {
          type: Sequelize.STRING(200),
          allowNull: false,
        },
        local: {
          type: Sequelize.STRING(400),
          allowNull: false,
        },
        theme: {
          type: Sequelize.STRING(2),
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
        modelName: "Destination",
        paranoid: false,
        charset: "utf8",
        collate: "utf8_general_ci",
      }
    );
  }
  static associate(db) {}
};
