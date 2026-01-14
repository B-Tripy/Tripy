const Sequelize = require("sequelize");
module.exports = class PhotoCategoryMaps extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        confidence_score: {
          type: Sequelize.FLOAT(5, 1),
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
        modelName: "PhotoCategoryMap",
        paranoid: false,
        charset: "utf8",
        collate: "utf8_general_ci",
      }
    );
  }
  static associate(db) {
    db.PhotoCategoryMap.belongsTo(db.Photo);
    db.PhotoCategoryMap.belongsTo(db.Category);
  }
};
