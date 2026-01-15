const express = require("express")
const router = express.Router()

// ==================== 인증 미들웨어 ====================
function requireAuth(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }
  return res.status(401).json({ error: "로그인이 필요합니다." })
}

// ==================== 시나리오 데이터 정의 ====================
// 단계별 시나리오를 정의합니다.
const SCENARIOS = {
  default: `안녕하세요! TRIPY 여행 도우미입니다. ✈️\n원하시는 메뉴를 입력해 주세요.\n\n1. 여행지 추천\n2. 인기 코스 안내\n3. 고객센터 연결`,
  recommend: `여행지 추천을 도와드릴게요! \n어떤 스타일의 여행을 원하시나요?\n(예: 힐링, 액티비티, 먹방)`,
  course: `현재 가장 인기 있는 코스는 '인천 개항로 투어'와 '가평 캠핑'입니다. \n상세 정보가 필요하시면 '인천' 또는 '가평'을 입력해 주세요.`,
  support: `상담원 연결을 원하시면 02-1234-5678로 연락 주시거나,\n'문의 남기기'라고 입력해 주세요.`,

  // 세부 키워드 응답
  healing: `힐링 여행지로는 '제주도 숲길'과 '남해 독일마을'을 추천드려요! 🌿`,
  activity: `액티비티를 좋아하신다면 '양양 서핑'이나 '단양 패러글라이딩' 어떠세요? 🏄‍♂️`,
  mukbang: `먹방 여행은 역시 '전주 한옥마을'과 '부산 자갈치 시장'이죠! 🥘`,
  incheon: `인천 개항로 투어: 차이나타운 -> 동화마을 -> 월미도 코스입니다. 🎡`,
  gapyeong: `가평 캠핑: 아침고요수목원 -> 남이섬 -> 자라섬 캠핑장 코스입니다. ⛺`,
  gohome: "이불 밖은 위험해요 😴 빨리 집에 가요!",
}

// ==================== 챗봇 라우터 ====================
router.post("/", requireAuth, async (req, res) => {
  const { userId, response } = req.body

  //챗봇 로직을 구현.
  let aiResponse = ""

  // 1. 메시지에 포함된 키워드를 분석하여 답변 결정 (간단한 규칙 기반)
  if (
    response.includes("안녕") ||
    response.includes("시작") ||
    response.includes("메뉴")
  ) {
    aiResponse = SCENARIOS.default
  } else if (response.includes("1") || response.includes("추천")) {
    aiResponse = SCENARIOS.recommend
  } else if (
    response.includes("2") ||
    response.includes("코스") ||
    response.includes("인기")
  ) {
    aiResponse = SCENARIOS.course
  } else if (
    response.includes("3") ||
    response.includes("상담") ||
    response.includes("고객")
  ) {
    aiResponse = SCENARIOS.support
  }
  // 세부 시나리오 (추천)
  else if (response.includes("힐링")) {
    aiResponse = SCENARIOS.healing
  } else if (response.includes("액티비티")) {
    aiResponse = SCENARIOS.activity
  } else if (response.includes("먹방")) {
    aiResponse = SCENARIOS.mukbang
  }
  // 세부 시나리오 (코스)
  else if (response.includes("인천")) {
    aiResponse = SCENARIOS.incheon
  } else if (response.includes("가평")) {
    aiResponse = SCENARIOS.gapyeong
  } else if (response.includes("집")) {
    aiResponse = SCENARIOS.gohome
  }
  // 예외 처리 (이해하지 못한 경우)
  else {
    aiResponse = `죄송합니다, '${response}'에 대한 정보는 아직 없어요. 😅\n다시 메뉴를 보고 싶으시면 '메뉴'라고 입력해 주세요.`
  }
  //AI 모델 호출, 데이터베이스 조회 등예정
  console.log(`User ID: ${userId}, Message: ${response}`)

  return res.json({ response: aiResponse })
})

module.exports = router
