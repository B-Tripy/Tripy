const Sequelize = require("sequelize");
module.exports = class Photos extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        photo: {
          type: Sequelize.STRING(200),
          allowNull: false,
        },
        url: {
          type: Sequelize.STRING(255),
          allowNull: false,
        },
        takenAt: {
          type: Sequelize.DATE,
          allowNull: false,
        },
        latitude: {
          type: Sequelize.FLOAT(10, 3),
          allowNull: true,
        },
        longtitude: {
          type: Sequelize.FLOAT(10, 3),
          allowNull: true,
        },
        address: {
          type: Sequelize.STRING(100),
          allowNull: true,
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
        modelName: "Photo",
        paranoid: false,
        charset: "utf8",
        collate: "utf8_general_ci",
      }
    );
  }
  static associate(db) {
    db.Photo.hasOne(db.Post);
    db.Photo.belongsTo(db.User);
    db.Photo.belongsTo(db.Trip);
    db.Photo.hasMany(db.PhotoCategoryMap);
    db.Photo.belongsTo(db.EmotionsTarget);
  }
};
