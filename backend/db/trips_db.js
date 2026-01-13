const pool = require("./db")

/**
 * id로 게시글 1개 조회
 * 반환: post 또는 null
 */
async function getPostById(id) {
  try {
    // 1. 쿼리 실행
    const [rows] = await pool.query("SELECT * FROM trips WHERE id = ?", [id])

    // 2. 데이터 존재 여부 확인 (데이터가 없으면 null 반환)
    if (!rows || rows.length === 0) {
      console.log(`ID ${id}에 해당하는 게시글을 찾을 수 없습니다.`)
      return null
    }

    // 3. 찾은 데이터 출력 및 반환
    console.log("조회된 데이터:", rows[0])
    return rows[0]
  } catch (error) {
    // 4. DB 연결 오류 등 예외 처리
    console.error("DB 조회 중 에러 발생:", error)
    throw error // 상위 라우터에서 에러를 잡을 수 있도록 던져줍니다.
  }
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
