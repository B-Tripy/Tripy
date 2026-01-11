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

// 함수 이름도 getPostsByUserId 등으로 바꾸는 게 좋습니다.
async function getPostsByIdAll(UserId) {
  // 1. 쿼리 수정: id(글번호) 대신 user_id(작성자번호)로 검색해야 여러 개가 나옵니다.
  // (DB 컬럼명이 user_id가 아니라면 해당 컬럼명으로 바꾸세요 ex: author_id)
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

  // 2. 리턴 수정: rows[0] 대신 rows 전체를 반환
  // 결과가 없으면 빈 배열 []이 반환되므로 null 체크를 굳이 안 해도 됩니다.
  return rows
}

module.exports = {
  getPostById,
  getPostsByIdAll,
}
