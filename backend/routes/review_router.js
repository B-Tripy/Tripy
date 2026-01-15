const express = require("express")
// 구조 분해 할당으로 함수들을 가져옵니다.
const {
  getPostById,
  getPostsByIdAll,
  savePhotoDescription,
} = require("../db/trips_db")
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
    const userId = req.user.id
    const posts = await getPostsByIdAll(userId)
    return res.status(200).json(posts)
  } catch (err) {
    console.error("게시글 목록 조회 오류:", err)
    return res.status(500).json({ error: "서버 오류" })
  }
})

// ==================== 게시글 상세 조회 ====================
router.get("/:id", requireAuth, async (req, res) => {
  try {
    const tripId = req.params.id
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

// ==================== [수정됨] 개별 사진 설명 저장 ====================
// 저장 버튼 클릭 시 호출됨
// 테스트를 위해 requireAuth 제거, userId = 1 고정
router.post("/:tripId/descriptions/:photoId", async (req, res) => {
  try {
    const { photoId } = req.params
    const { post } = req.body

    // const userId = req.user.id; // 실제 로그인 시 사용
    const userId = 1 // 테스트용 임시 ID (DB에 id가 1인 유저가 있어야 함)

    if (post === undefined) {
      return res.status(400).json({ error: "내용이 없습니다." })
    }

    // DB 저장 함수 호출
    await savePhotoDescription(photoId, userId, post)

    return res.status(200).json({ message: "성공적으로 저장되었습니다." })
  } catch (err) {
    console.error("개별 사진 설명 저장 오류:", err)
    return res.status(500).json({ error: "서버 오류" })
  }
})

module.exports = router
