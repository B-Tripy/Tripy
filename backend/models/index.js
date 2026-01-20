const Sequelize = require("sequelize")
const env = process.env.NODE_ENV || "development"
const config = require(__dirname + "/../config/config.json")[env]
const fs = require("fs")
const path = require("path")
const Users = require("./users")
const Trips = require("./trips")
const Photos = require("./photos")
const Posts = require("./posts")
const Emotions = require("./emotions")
const EmotionsTargets = require("./emotionstargets")
const Destinations = require("./destinations")
const Themes = require("./themes")
const PhotoCategoryMaps = require("./photoCategoryMaps")
const Categories = require("./categories")
const Bookmarks = require("./bookmarks")
const UserTrips = require("./usertrip")

const db = {}

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config,
)

db.sequelize = sequelize

// 2. 모델 자동 로딩 (로그 추가됨)
console.log("[Debug] 모델 파일 로딩 시작:", __dirname)

fs.readdirSync(__dirname)
  .filter((file) => {
    // .js 파일만 골라내고, index.js는 제외
    return (
      file.indexOf(".") !== 0 && file !== "index.js" && file.slice(-3) === ".js"
    )
  })
  .forEach((file) => {
    try {
      // 파일 불러오기
      const model = require(path.join(__dirname, file))

      // 모델 초기화 (init)
      if (model.init) {
        model.init(sequelize)
        db[model.name] = model
        console.log(`모델 등록 성공: ${file} -> ${model.name}`)
      } else {
        console.warn(`모델 초기화 실패 (init 없음): ${file}`)
      }
    } catch (error) {
      console.error(`모델 파일 로드 중 에러: ${file}`, error)
    }
  })

// 3. 관계 설정 (associate)
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    console.log(`관계 설정 중: ${modelName}`)
    db[modelName].associate(db)
  }
})
db.Users = Users
db.Trips = Trips
db.Photos = Photos
db.Posts = Posts
db.Emotions = Emotions
db.EmotionsTargets = EmotionsTargets
db.Destinations = Destinations
db.Themes = Themes
db.PhotoCategoryMaps = PhotoCategoryMaps
db.Categories = Categories
db.Bookmarks = Bookmarks
db.UserTrips = UserTrips

Users.init(sequelize)
Trips.init(sequelize)
Photos.init(sequelize)
Posts.init(sequelize)
Emotions.init(sequelize)
EmotionsTargets.init(sequelize)
Destinations.init(sequelize)
Themes.init(sequelize)
PhotoCategoryMaps.init(sequelize)
Categories.init(sequelize)
Bookmarks.init(sequelize)
UserTrips.init(sequelize)

Users.associate(db)
Trips.associate(db)
Photos.associate(db)
Posts.associate(db)
Emotions.associate(db)
EmotionsTargets.associate(db)
Destinations.associate(db)
Themes.associate(db)
PhotoCategoryMaps.associate(db)
Categories.associate(db)
Bookmarks.associate(db)
UserTrips.associate(db)

module.exports = db
