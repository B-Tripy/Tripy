// server/db_layer/user_db.js
const pool = require("./db");

async function jointrip(userId, tripId) {
  const [counts] = await pool.query(
    "SELECT count(*) as count from usertrip where UserId=? and TripId=?",
    [userId, tripId]
  );
  if (counts[0].count > 0) throw new Error("이미 등록된 여행 입니다.");
  const [rows] = await pool.query(
    "INSERT INTO usertrip (UserId,TripId)VALUES(?,?)",
    [userId, tripId]
  );
  if (!rows || rows.length === 0) return null;
  return rows[0];
}

module.exports = {
  jointrip,
};
