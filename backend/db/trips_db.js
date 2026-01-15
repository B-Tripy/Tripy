const pool = require("./db")

/**
 * id로 게시글 1개와 해당 게시글의 모든 사진 조회
 */
async function getPostById(id) {
  try {
    const [posts] = await pool.query("SELECT * FROM trips WHERE id = ?", [id])

    if (!posts || posts.length === 0) {
      console.log(`ID ${id}에 해당하는 게시글을 찾을 수 없습니다.`)
      return null
    }

    const post = posts[0]

    const [photos] = await pool.query(
      "SELECT id, url, photo FROM photos WHERE TripId = ? ORDER BY id ASC",
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
 * 특정 사용자가 참여한 모든 게시글 조회
 */
async function getPostsByIdAll(UserId) {
  try {
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

    return rows
  } catch (error) {
    console.error("사용자 게시글 목록 조회 에러:", error)
    throw error
  }
}

/**
 * 사진 설명(post) 저장/수정 함수 (추가됨)
 */
async function savePhotoDescription(photoId, userId, content) {
  try {
    // 1. 해당 사진에 대해 이미 작성된 글이 있는지 확인
    const [rows] = await pool.query("SELECT id FROM posts WHERE PhotoId = ?", [
      photoId,
    ])

    if (rows.length > 0) {
      // 2-1. 이미 있으면 UPDATE
      await pool.query("UPDATE posts SET post = ? WHERE PhotoId = ?", [
        content,
        photoId,
      ])
      return { message: "Updated", id: rows[0].id }
    } else {
      // 2-2. 없으면 INSERT (points 컬럼 기본값 0 추가)
      const [result] = await pool.query(
        "INSERT INTO posts (post, UserId, PhotoId, points, createdAt) VALUES (?, ?, ?, 0, NOW())",
        [content, userId, photoId]
      )
      return { message: "Created", id: result.insertId }
    }
  } catch (error) {
    console.error("사진 설명 저장 중 에러:", error)
    throw error
  }
}

// 중요: 여기서 함수들을 꼭 내보내야 다른 파일에서 쓸 수 있습니다.
module.exports = {
  getPostById,
  getPostsByIdAll,
  savePhotoDescription,
}
