const pool = require("./db")

/**
 * id로 게시글 1개 조회
 */
async function getPostById(id) {
  try {
    const [rows] = await pool.query("SELECT * FROM trips WHERE id = ?", [id])

    if (!rows || rows.length === 0) {
      return null
    }

    const post = rows[0]

    const [photos] = await pool.query(
      `SELECT 
        ph.id, 
        ph.url, 
        ph.photo, 
        po.post AS content,    -- 이미 작성된 글 내용
        po.UserId AS authorId  -- 글 작성자 ID (중요)
      FROM photos ph
      LEFT JOIN posts po ON ph.id = po.PhotoId
      WHERE ph.TripId = ? 
      ORDER BY ph.id ASC`,
      [id]
    )

    const result = {
      ...post,
      images: photos,
    }

    return result
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
      SELECT t.*, ut.owner 
      FROM trips t
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

async function getTripCountById(UserId) {
  const queryStr = `
    SELECT 
      COUNT(CASE WHEN t.start_date > CURDATE() THEN 1 END) AS upcoming,
      COUNT(CASE WHEN t.start_date <= CURDATE() AND t.end_date >= CURDATE() THEN 1 END) AS ongoing,
      COUNT(CASE WHEN t.end_date < CURDATE() THEN 1 END) AS completed
    FROM usertrip AS ut
    JOIN trips AS t ON ut.TripId = t.id
    WHERE ut.UserId = ?
  `
  try {
    const [rows] = await pool.query(queryStr, [UserId])
    return rows[0]
  } catch (err) {
    console.error("DB 통계 조회 Error:", err)
    throw err
  }
}

async function savePhotoDescription(photoId, userId, content) {
  try {
    const [rows] = await pool.query(
      "SELECT id, UserId FROM posts WHERE PhotoId = ?",
      [photoId]
    )

    if (rows.length > 0) {
      if (rows[0].UserId !== userId) {
        throw new Error("PERMISSION_DENIED")
      }
      await pool.query("UPDATE posts SET post = ? WHERE PhotoId = ?", [
        content,
        photoId,
      ])
      return { message: "Updated", id: rows[0].id }
    } else {
      const [result] = await pool.query(
        "INSERT INTO posts (post, UserId, PhotoId, points, createdAt) VALUES (?, ?, ?, 0, NOW())",
        [content, userId, photoId]
      )
      return { message: "Created", id: result.insertId }
    }
  } catch (error) {
    if (error.message === "PERMISSION_DENIED") throw error
    console.error("사진 설명 저장 중 에러:", error)
    throw error
  }
}

module.exports = {
  getPostById,
  getPostsByIdAll,
  getTripCountById, // 이제 정상적으로 참조됨
  savePhotoDescription,
}
