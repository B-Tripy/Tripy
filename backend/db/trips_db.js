const pool = require("./db")

/**
 * id로 게시글 1개 조회
 * 반환: post 또는 null
 */
async function getPostById(id) {
  const [rows] = await pool.query("SELECT * FROM trips WHERE id = ?", [id])
  console.log(rows[0])
  if (!rows || rows.length === 0) return null
  return rows[0]
}
//id로 작성자id의 모든 게시글 조회
async function getPostsByIdAll(UserId) {
  const [trip_rows] = await pool.query(
    "SELECT TripId FROM usertrip WHERE Userid = ?",
    [UserId]
  )
  const tripIds = trip_rows.map((row) => row.TripId)

  if (tripIds.length === 0) {
    return []
  }

  const [rows] = await pool.query("SELECT * FROM trips WHERE id IN (?)", [
    tripIds,
  ])
  console.log(rows) // 배열이 출력됩니다.

  return rows
}

module.exports = {
  getPostById,
  getPostsByIdAll,
}
