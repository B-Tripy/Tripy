const { Photo, PhotoCategoryMap, Category } = require("../models")

const albumDb = {
  // 1. 내 사진 중 중복 체크 (날짜 + 사용자ID)
  findMyPhoto: async (userId, takenAt) => {
    return await Photo.findOne({
      where: {
        takenAt: takenAt,
        UserId: userId,
      },
      include: [{ model: PhotoCategoryMap, include: [Category] }],
    })
  },

  // 2. 전체 사용자 중 중복 체크 (날짜 기준, 파일 재사용)
  findGlobalPhoto: async (takenAt) => {
    return await Photo.findOne({
      where: { takenAt: takenAt },
    })
  },

  // 3. 사진 정보 저장
  createPhoto: async (data, t) => {
    return await Photo.create(data, { transaction: t })
  },

  // 4. 카테고리 매핑 정보 저장
  createCategoryMaps: async (mapData, t) => {
    return await PhotoCategoryMap.bulkCreate(mapData, { transaction: t })
  },

  // 5. 사진 목록 조회 (카테고리 포함)
  getUserPhotos: async (userId) => {
    return await Photo.findAll({
      where: { UserId: userId },
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: PhotoCategoryMap,
          attributes: ["confidence_score"],
          include: [
            {
              model: Category,
              attributes: ["category"],
            },
          ],
        },
      ],
    })
  },
}

module.exports = albumDb
