const Sequelize = require("sequelize");

module.exports = class Photos extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        id: {
          // PK 명시
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
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
        tableName: "photos",
        createdAt: true,
        updatedAt: false,
        paranoid: false,
        charset: "utf8",
        collate: "utf8_general_ci",
      },
    );
  }

  static associate(db) {
    // ✅ Photos ↔ Categories (M:N)
    db.Photos.belongsToMany(db.Categories, {
      through: db.PhotoCategoryMaps,
      foreignKey: "photoId", // 중간 테이블의 FK
      otherKey: "categoryId", // 중간 테이블의 FK
      as: "categories",
    });

    db.Photos.hasMany(db.PhotoCategoryMaps, { 
    foreignKey: "photoId", 
    as: "PhotoMaps" // 'PhotoCategoryMaps' 대신 다른 이름을 사용하세요.
  });

    // ✅ Photos ↔ Posts (1:1)
    db.Photos.hasOne(db.Posts, {
      foreignKey: "photoId",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });

    // ✅ Photos ↔ Users (N:1)
    db.Photos.belongsTo(db.Users, {
      foreignKey: "userId",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });

    // ✅ Photos ↔ Trips (N:1)
    db.Photos.belongsTo(db.Trips, {
      foreignKey: "tripId",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });

    // ✅ Photos ↔ EmotionsTargets (1:N)
    db.Photos.hasMany(db.EmotionsTargets, {
      foreignKey: "photoId",
    });
  }
};
