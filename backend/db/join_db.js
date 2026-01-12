// server/db_layer/user_db.js
const pool = require("./db");

async function jointrip(tripId, userId) {
  const [rows] = await pool.query(
    "insert into usertrip (UserId,TripId,createdAt) values(?,?,?)",
    [userId, tripId, now()]
  );
  if (!rows || rows.length === 0) return null;
  return rows[0];
}

module.exports = {
  jointrip,
};
