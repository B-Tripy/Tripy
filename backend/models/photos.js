const Sequelize = require("sequelize")
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
          type: Sequelize.FLOAT(9, 6),
          allowNull: true,
        },
        longitude: {
          type: Sequelize.FLOAT(9, 6),
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
      },
      {
        sequelize,
        timestamps: true,
        underscored: false,
        modelName: "Photos",
        createdAt: true,
        updatedAt: false,
        paranoid: false,
        charset: "utf8",
        collate: "utf8_general_ci",
      }
    )
  }
  static associate(db) {
    db.Photos.hasOne(db.Posts)
    db.Photos.belongsTo(db.Users)
    db.Photos.belongsTo(db.Trips)
    db.Photos.hasMany(db.PhotoCategoryMaps)
    db.Photos.belongsTo(db.EmotionsTargets)
  }
}
