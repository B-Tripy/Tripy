const Sequelize = require("sequelize");
const env = process.env.NODE_ENV || "development";
const config = require(__dirname + "/../config/config.json")[env];

const User = require("./users");
const Trip = require("./trips");
const Photo = require("./photos");
const Post = require("./posts");
const Emotion = require("./emotions");
const EmotionsTarget = require("./emotionstargets");
const Destination = require("./destinations");
const Theme = require("./themes");
const PhotoCategoryMap = require("./photoCategoryMaps");
const Category = require("./categories");

const db = {};

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);

db.sequelize = sequelize;

db.User = User;
db.Trip = Trip;
db.Photo = Photo;
db.Post = Post;
db.Emotion = Emotion;
db.EmotionsTarget = EmotionsTarget;
db.Destination = Destination;
db.Theme = Theme;
db.PhotoCategoryMap = PhotoCategoryMap;
db.Category = Category;

User.init(sequelize);
Trip.init(sequelize);
Photo.init(sequelize);
Post.init(sequelize);
Emotion.init(sequelize);
EmotionsTarget.init(sequelize);
Destination.init(sequelize);
Theme.init(sequelize);
PhotoCategoryMap.init(sequelize);
Category.init(sequelize);

User.associate(db);
Trip.associate(db);
Photo.associate(db);
Post.associate(db);
Emotion.associate(db);
EmotionsTarget.associate(db);
Destination.associate(db);
Theme.associate(db);
PhotoCategoryMap.associate(db);
Category.associate(db);

module.exports = db;
