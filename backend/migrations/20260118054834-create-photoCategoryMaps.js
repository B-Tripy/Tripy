"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("photoCategoryMaps", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      confidence_score: {
        type: Sequelize.FLOAT(5, 4),
        allowNull: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      photoId: {
        type: Sequelize.INTEGER,
        references: { model: "photos", key: "id" },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      categoryId: {
        type: Sequelize.INTEGER,
        references: { model: "categories", key: "id" },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("photoCategoryMaps");
  },
};
