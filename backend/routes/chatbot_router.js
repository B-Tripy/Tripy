const express = require("express")
const router = express.Router()

// ==================== 인증 미들웨어 ====================
function requireAuth(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }
  return res.status(401).json({ error: "로그인이 필요합니다." })
}

// ==================== 챗봇 라우터 ====================
router.post("/", requireAuth, async (req, res) => {
  const { userId, response } = req.body

  // 여기에 챗봇 로직을 구현합니다.
  // 예: AI 모델 호출, 데이터베이스 조회 등
  console.log(`User ID: ${userId}, Message: ${response}`)
  const aiResponse = `챗봇 응답: "${response}"에 대한 답변입니다.`

  return res.json({ response: aiResponse })
})

module.exports = router
