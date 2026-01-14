import { useState } from "react"

export default function Plan() {
  const [activities, setActivities] = useState([])
  const [people, setPeople] = useState("")

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f5f5f5",
        padding: "0 32px",
        paddingTop: "150px",
      }}
    >
      <h1 style={{ marginBottom: "24px", fontSize: "20px", fontWeight: "600" }}>
        Plan Page
      </h1>

      <div style={{ display: "flex", gap: "24px", justifyContent: "center" }}>
        {/* 필수사항 카드 */}
        <div style={cardStyle}>
          <h4 style={{ marginBottom: "20px" }}>
            필수사항<span style={{ color: "red" }}>*</span>
          </h4>

          <div
            style={{ display: "flex", flexDirection: "column", gap: "20px" }}
          >
            {/* 출발지 / 목적지 */}
            <div style={{ display: "flex", gap: "16px" }}>
              <div style={{ flex: 1 }}>
                <p style={labelStyle}>출발지</p>
                <input type="text" placeholder="출발지" style={inputStyle} />
              </div>
              <div style={{ flex: 1 }}>
                <p style={labelStyle}>목적지</p>
                <input type="text" placeholder="목적지" style={inputStyle} />
              </div>
            </div>

            {/* 출발 날짜 / 도착 날짜 */}
            <div style={{ display: "flex", gap: "16px" }}>
              <div style={{ flex: 1 }}>
                <p style={labelStyle}>출발 날짜</p>
                <input
                  type="date"
                  placeholder="연도-월-일"
                  style={inputStyle}
                />
              </div>
              <div style={{ flex: 1 }}>
                <p style={labelStyle}>도착 날짜</p>
                <input
                  type="date"
                  placeholder="연도-월-일"
                  style={inputStyle}
                />
              </div>
            </div>

            {/* 인원 */}
            <div>
              <p style={labelStyle}>인원</p>
              <select
                style={{
                  ...selectStyle,
                  color: people ? "#333" : "#999",
                }}
                value={people}
                onChange={(e) => setPeople(e.target.value)}
              >
                <option value="">선택해주세요</option>
                <option value="1">1명</option>
                <option value="2">2명</option>
                <option value="3">3명</option>
                <option value="4">4명</option>
                <option value="5+">5명 이상</option>
              </select>
            </div>
            {/* 동행자 초대 */}
            <div style={{ display: "flex", gap: "16px" }}>
              <div style={{ flex: 1 }}>
                <p style={labelStyle}>동행자 초대</p>
                <input
                  type="text"
                  placeholder="아이디 검색"
                  style={inputStyle}
                />
              </div>
            </div>
            <div>
              <p style={labelStyle}>선호 활동</p>

              <div style={activityGrid}>
                {["관광", "맛집", "쇼핑", "자연", "문화", "레저"].map(
                  (item) => {
                    const selected = activities.includes(item)

                    return (
                      <button
                        key={item}
                        onClick={() => {
                          setActivities((prev) =>
                            prev.includes(item)
                              ? prev.filter((v) => v !== item)
                              : [...prev, item]
                          )
                        }}
                        style={{
                          ...activityBox,
                          backgroundColor: selected ? "#f5f5f5" : "#fff",
                          color: selected ? "#333" : "#333",
                          border: selected
                            ? "1px solid #88AC73"
                            : "1px solid #ddd",
                        }}
                      >
                        {item}
                      </button>
                    )
                  }
                )}
              </div>
              <button
                style={generateButton}
                onMouseOver={(e) => (e.currentTarget.style.opacity = 0.9)}
                onMouseOut={(e) => (e.currentTarget.style.opacity = 1)}
              >
                AI 일정 생성
              </button>
            </div>
          </div>
        </div>

        {/* 선택사항 카드 */}
        <div style={cardStyle}>
          <h4 style={{ marginBottom: "20px" }}>선택사항</h4>

          <div
            style={{ display: "flex", flexDirection: "column", gap: "20px" }}
          >
            {/* 음식 선호 */}
            <div style={{ display: "flex", gap: "16px" }}>
              <div style={{ flex: 1 }}>
                <p style={labelStyle}>음식 선호</p>
                <input
                  type="text"
                  placeholder="예: 해산물, 채식 등"
                  style={inputStyle}
                />
              </div>
            </div>
            {/* 연령대 */}
            <div>
              <p style={labelStyle}>연령대</p>
              <select
                style={{
                  ...selectStyle,
                  color: people ? "#333" : "#999",
                }}
                value={people}
                onChange={(e) => setPeople(e.target.value)}
              >
                <option value="">선택해주세요</option>
                <option value="20">20대</option>
                <option value="30">30대</option>
                <option value="40">40대</option>
                <option value="50+">50대 이상</option>
              </select>
            </div>
            {/* 여행 목적 */}
            <div style={{ display: "flex", gap: "16px" }}>
              <div style={{ flex: 1 }}>
                <p style={labelStyle}>여행 목적</p>
                <input
                  type="text"
                  placeholder="예: 가족 여행, 신혼 여행 등"
                  style={inputStyle}
                />
              </div>
            </div>
            {/* 추가 요구사항 */}
            <div style={{ display: "flex", gap: "16px" }}>
              <div style={{ flex: 1 }}>
                <p style={labelStyle}>추가 요구사항</p>
                <input
                  type="text"
                  placeholder="특별히 고려해야 할 사항이나 원하는 활동을 자유롭게 입력해주세요"
                  style={writeStyle}
                />
              </div>
            </div>
          </div>
        </div>

        {/* AI일정 카드 */}
        <div style={cardStyle}>
          <h4>생성된 AI일정</h4>

          <div
            style={{
              height: "100%",
              minHeight: "360px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center", // 세로 가운데
              alignItems: "center", // 가로 가운데
              textAlign: "center",
              color: "#888",
              fontSize: "13px",
              lineHeight: "1.6",
            }}
          >
            {" "}
            <div
              style={{
                width: "64px",
                height: "64px",
                borderRadius: "50%",
                background: "#eee",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "16px",
              }}
            >
              📅
            </div>
            <p>왼쪽 폼에서 정보를 입력하고</p>
            <p>AI 일정 생성 버튼을 눌러주세요</p>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ===== styles ===== */

const cardStyle = {
  background: "#fff",
  borderRadius: "8px",
  padding: "24px",
  width: "28%",
  boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
}

const labelStyle = {
  marginBottom: "6px",
  fontSize: "14px",
}

const inputStyle = {
  width: "100%",
  height: "40px",
  border: "1px solid #ddd",
  borderRadius: "6px",
  padding: "0 12px",
  display: "flex",
  alignItems: "center",
  color: "#333",
}

const writeStyle = {
  width: "100%",
  height: "300px",
  border: "1px solid #ddd",
  borderRadius: "6px",
  padding: "12px",
  color: "#333",
  fontSize: "14px",
  boxSizing: "border-box",
}

const selectStyle = {
  height: "40px",
  width: "100%",
  borderRadius: "6px",
  border: "1px solid #ddd",
  padding: "0 12px",
}

const activityGrid = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "12px",
}

const activityBox = {
  height: "40px",
  borderRadius: "6px",
  fontSize: "14px",
  cursor: "pointer",
}

const generateButton = {
  width: "100%",
  height: "48px",
  borderRadius: "8px",
  backgroundColor: "#88AC73",
  color: "#fff",
  fontSize: "15px",
  fontWeight: "600",
  border: "none",
  cursor: "pointer",
  marginTop: "20px",
}
