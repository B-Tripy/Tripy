// server/db_layer/user_db.js
const pool = require("./db");

/**
 * username + password로 사용자 조회
 * - 로그인용
 * - 반환: { id, username, createdAt } 또는 null
 */
async function findUserByCredentials(email, password) {
  const [rows] = await pool.query(
    "SELECT id, nickname, createdAt FROM users WHERE email = ? AND password = ?",
    [email, password]
  );
  if (!rows || rows.length === 0) return null;
  return rows[0];
}
async function findUserById(id) {
  const [rows] = await pool.query(
    "SELECT id, nickname, createdAt FROM users WHERE id = ? ",
    [id]
  );
  if (!rows || rows.length === 0) return null;
  return rows[0];
}
async function findUserByEmail(email) {
  const [rows] = await pool.query(
    "SELECT id, nickname,password FROM users WHERE email = ? ",
    [email]
  );
  if (!rows || rows.length === 0) return null;
  return rows[0];
}
async function createUser(nickname, email, password) {
  await pool.query("INSERT INTO USERS (nickname,email,password)VALUES(?,?,?)", [
    nickname,
    email,
    password,
  ]);
}
async function getUsers() {
  const [rows] = await pool.query(
    "SELECT id,nickname,email FROM users WHERE search=1;"
  );
  if (!rows || rows.length === 0) return null;

  return rows;
}
async function toggle(userId, checked) {
  console.log(userId);
  value = checked === 1 ? 0 : 1;
  await pool.query("UDATE USERS SET search=? where id=?"), [value, userId];
  if (!rows || rows.length === 0) return null;

  return rows;
}
module.exports = {
  findUserByCredentials,
  findUserById,
  findUserByEmail,
  createUser,
  getUsers,
  toggle,
};
