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
async function withdrawtrip(userId, tripId) {
  const [counts] = await pool.query(
    "SELECT count(*) as count from usertrip where UserId=? and TripId=?",
    [userId, tripId]
  );
  if (counts[0].count === 0) throw new Error("등록되지 않은 여행 입니다.");
  const [rows] = await pool.query(
    "DELETE FROM usertrip WHERE UserId=? and TripId=?",
    [userId, tripId]
  );
  if (!rows || rows.length === 0) return null;
  return rows[0];
}
async function getUsers() {
  const [rows] = await pool.query(
    "SELECT id,nickname,email FROM users WHERE search=1;"
  );
  if (!rows || rows.length === 0) return null;

  return rows;
}
async function toggleAction(userId, checked) {
  console.log(userId, checked);
  value = checked === false ? 0 : 1;
  const [rows] = await pool.query("UPDATE USERS SET search=? where id=?", [
    value,
    userId,
  ]);
  if (!rows || rows.length === 0) return null;
  // console.log(rows);
  return rows[0];
}
async function getUserByEmail(email) {
  const [rows] = await pool.query(
    "SELECT id,nickname FROM users WHERE email=?",
    [email]
  );
  if (!rows || rows.length === 0) return null;

  return rows;
}
module.exports = {
  jointrip,
  withdrawtrip,
  getUsers,
  toggleAction,
  getUserByEmail,
};
