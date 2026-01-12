const express = require("express")
const { getPostById, getPostsByIdAll } = require("../db/trips_db")
const router = express.Router()

// ==================== 인증 미들웨어 ====================
function requireAuth(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }
  return res.status(401).json({ error: "로그인이 필요합니다." })
}

// ==================== 게시글 목록 ====================
router.get("/", requireAuth, async (req, res) => {
  try {
    const userId = req.user.id // 로그인된 사용자 ID
    const posts = await getPostsByIdAll(userId)

    return res.status(200).json(posts)
  } catch (err) {
    console.error("게시글 목록 조회 오류:", err)
    return res.status(500).json({ error: "서버 오류" })
  }
})

router.get("/:id", requireAuth, async (req, res) => {
  try {
    const tripId = req.params.id
    const userId = req.user.id // 본인의 게시글인지 확인하기 위해 필요할 수 있음

    // DB에서 tripId로 조회
    const post = await getPostById(tripId)

    if (!post) {
      return res.status(404).json({ error: "게시글을 찾을 수 없습니다." })
    }

    return res.status(200).json(post)
  } catch (err) {
    console.error("게시글 상세 조회 오류:", err)
    return res.status(500).json({ error: "서버 오류" })
  }
})

module.exports = router
