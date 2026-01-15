// chatbotLogic.js
const SCENARIOS = require("./chatbotData")

const getBotResponse = (message) => {
  // 공백 제거 및 소문자 변환 (영어 입력 대비)
  const msg = message.trim().replace(/ /g, "")

  // === 1. 메인 메뉴 & 초기화 ===
  const helloKeywords = ["안녕", "반가", "하이", "시작", "메뉴", "처음"]
  if (helloKeywords.some((keyword) => msg.includes(keyword))) {
    return SCENARIOS.welcome
  }

  // === 2. 여행지 추천 (진입) ===
  if (msg.includes("1") || msg.includes("추천") || msg.includes("여행지")) {
    return SCENARIOS.recommend_main
  }

  // === 3. 인기 코스 (진입) ===
  if (msg.includes("2") || msg.includes("코스") || msg.includes("인기")) {
    return SCENARIOS.course_main
  }

  // === 4. 고객센터 (진입) ===
  if (
    msg.includes("3") ||
    msg.includes("문의") ||
    msg.includes("센터") ||
    msg.includes("도움")
  ) {
    return SCENARIOS.support
  }
  if (msg.includes("상담") || msg.includes("연결")) {
    return SCENARIOS.agent_connect
  }

  // === 5. 세부 시나리오 (추천) ===
  if (msg.includes("힐링") || msg.includes("휴식") || msg.includes("숲"))
    return SCENARIOS.healing
  if (msg.includes("액티비티") || msg.includes("서핑") || msg.includes("운동"))
    return SCENARIOS.activity
  if (msg.includes("먹방") || msg.includes("맛집") || msg.includes("음식"))
    return SCENARIOS.mukbang

  // === 6. 세부 시나리오 (코스) ===
  if (msg.includes("인천") || msg.includes("월미도") || msg.includes("차이나"))
    return SCENARIOS.course_incheon
  if (msg.includes("가평") || msg.includes("남이섬") || msg.includes("캠핑"))
    return SCENARIOS.course_gapyeong

  // === 7. 이스터 에그 ===
  if (msg.includes("집") || msg.includes("퇴근") || msg.includes("힘들"))
    return SCENARIOS.gohome

  // === [추가] 감정 표현 및 이모티콘 처리 ===
  if (
    msg.includes("ㅡㅡ") ||
    msg.includes("-_-") ||
    msg.includes("짜증") ||
    msg.includes("바보") ||
    msg.includes("답답")
  ) {
    return SCENARIOS.angry
  }
  if (
    msg.includes("ㅠㅠ") ||
    msg.includes("ㅜㅜ") ||
    msg.includes("ㅠ") ||
    msg.includes("우울")
  ) {
    return SCENARIOS.sad
  }
  if (
    msg.includes("ㅋㅋ") ||
    msg.includes("ㅎㅎ") ||
    msg.includes("ㅋ") ||
    msg.includes("ㅎ")
  ) {
    return SCENARIOS.laugh
  }

  // === 8. 이해 불가 ===
  return SCENARIOS.unknown(message)
}

module.exports = { getBotResponse }
