const pool = require("./db")

/**
 * id로 게시글 1개 조회
 */
async function getPostById(id) {
  try {
    const [rows] = await pool.query("SELECT * FROM trips WHERE id = ?", [id])

    if (!rows || rows.length === 0) {
      console.log(`ID ${id}에 해당하는 게시글을 찾을 수 없습니다.`)
      return null
    }

    console.log("조회된 데이터:", rows[0])
    return rows[0]
  } catch (error) {
    console.error("DB 조회 중 에러 발생:", error)
    throw error
  }
}

/**
 * [최적화됨] 사용자 ID(UserId)로 관련된 모든 여행 게시글 조회
 * JOIN을 사용하여 쿼리 1번으로 해결
 */
async function getPostsByIdAll(UserId) {
  try {
    // usertrip 테이블과 trips 테이블을 조인하여 한 번에 가져옵니다.
    const sql = `
      SELECT t.* FROM trips t
      JOIN usertrip ut ON t.id = ut.TripId
      WHERE ut.UserId = ?
    `
    const [rows] = await pool.query(sql, [UserId])

    console.log(`사용자 ${UserId}의 게시글 수: ${rows.length}`)
    return rows // 데이터가 없으면 빈 배열 []이 반환되므로 별도 처리 불필요
  } catch (error) {
    console.error("전체 게시글 조회 중 에러:", error)
    throw error
  }
}

/**
 * 사용자 ID로 여행 상태별 카운트 조회
 */
async function getTripCountById(UserId) {
  const queryStr = `
    SELECT 
      COUNT(CASE WHEN t.start_date > CURDATE() THEN 1 END) AS upcoming,
      COUNT(CASE WHEN t.start_date <= CURDATE() AND t.end_date >= CURDATE() THEN 1 END) AS ongoing,
      COUNT(CASE WHEN t.end_date < CURDATE() THEN 1 END) AS completed
    FROM UserTrip AS ut
    JOIN Trips AS t ON ut.TripId = t.id
    WHERE ut.UserId = ?
  `

  try {
    const [rows] = await pool.query(queryStr, [UserId])
    console.log("통계 데이터:", rows[0])
    return rows[0]
  } catch (err) {
    console.error("DB 통계 조회 Error:", err)
    throw err
  }
}

module.exports = {
  getPostById,
  getPostsByIdAll,
  getTripCountById,
}
