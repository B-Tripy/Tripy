const express = require("express")
const router = express.Router()
const { getBotResponse } = require("../chatbotdata/chatbotLogic")

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

  console.log(`User ID: ${userId}, Message: ${response}`)

  //시나리오 로직
  const aiResponse = getBotResponse(response)
  //AI 모델 호출, 데이터베이스 조회 등예정

  return res.json({ response: aiResponse })
})

module.exports = router
