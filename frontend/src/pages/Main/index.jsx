import React from "react"

const Main = () => {
  // 데이터 (여행 목록)
  const recentTrips = [
    {
      id: 1,
      title: "제주도 푸른 밤",
      location: "대한민국, 제주도",
      date: "2024년 7월 10일 ~ 7월 14일",
      imgUrl: "./assets/img/tripy.png",
    },
    {
      id: 2,
      title: "오사카 미식 탐방",
      location: "일본, 오사카",
      date: "2024년 8월 3일 ~ 8월 9일",
      imgUrl: "./assets/img/tripy.png",
    },
    {
      id: 3,
      title: "방콕 문화 유산 탐방",
      location: "태국, 방콕",
      date: "2024년 9월 1일 ~ 9월 6일",
      imgUrl: "./assets/img/tripy.png",
    },
    {
      id: 4,
      title: "파리 낭만 여행",
      location: "프랑스, 파리",
      date: "2024년 10월 15일 ~ 10월 20일",
      imgUrl: "./assets/img/tripy.png",
    },
  ]

  // ★ 스타일 객체 정의 (CSS를 자바스크립트 객체로 변환)
  const styles = {
    container: {
      maxWidth: "1152px",
      margin: "0 auto",
      padding: "2rem",
      fontFamily: "'Noto Sans KR', sans-serif",
      color: "#1f2937",
      boxSizing: "border-box",
    },
    // 헤더 영역
    header: {
      marginBottom: "2.5rem",
    },
    title: {
      fontSize: "1.5rem",
      fontWeight: "700",
      color: "#111827",
      marginBottom: "0.25rem",
    },
    description: {
      color: "#6b7280",
      marginBottom: "1.5rem",
    },
    buttonGroup: {
      display: "flex",
      gap: "0.75rem",
    },
    // 버튼 공통
    btn: {
      padding: "0.625rem 1.25rem",
      borderRadius: "0.5rem",
      fontWeight: "500",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      gap: "0.5rem",
      fontSize: "1rem",
      border: "none",
    },
    btnPrimary: {
      backgroundColor: "#8CBF68",
      color: "white",
    },
    btnSecondary: {
      backgroundColor: "white",
      border: "1px solid #d1d5db",
      color: "#374151",
    },
    // 섹션 공통
    sectionTitle: {
      fontSize: "1.125rem",
      fontWeight: "700",
      marginBottom: "1rem",
      marginTop: "2.5rem",
    },
    // 그리드 레이아웃
    grid: {
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)", // 3열 고정
      gap: "1.5rem",
    },
    card: {
      backgroundColor: "white",
      padding: "1.5rem",
      borderRadius: "0.75rem",
      border: "1px solid #f3f4f6",
      boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
      height: "8rem",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
    },
    cardTop: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start",
    },
    iconBox: {
      display: "flex",
      alignItems: "center",
      gap: "0.75rem",
    },
    iconCircle: {
      width: "2.5rem",
      height: "2.5rem",
      borderRadius: "50%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    // 리스트 아이템
    tripList: {
      display: "flex",
      flexDirection: "column",
      gap: "0.75rem",
    },
    tripItem: {
      backgroundColor: "white",
      padding: "1rem",
      borderRadius: "0.75rem",
      border: "1px solid #f3f4f6",
      boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      cursor: "pointer",
    },
    tripInfo: {
      display: "flex",
      alignItems: "center",
      gap: "1rem",
    },
    tripThumb: {
      width: "4rem",
      height: "4rem",
      borderRadius: "0.5rem",
      overflow: "hidden",
      backgroundColor: "#e5e7eb",
    },
    img: {
      width: "100%",
      height: "100%",
      objectFit: "cover",
    },
    // 기타 유틸
    textGreen: { color: "#8CBF68" },
    textOrange: { color: "#fb923c" },
    bgGreenLight: { backgroundColor: "#f0fdf4", color: "#8CBF68" },
    bgOrangeLight: { backgroundColor: "#fff7ed", color: "#fb923c" },
    tripTitle: {
      margin: 0,
      fontSize: "1rem",
      fontWeight: "700",
      color: "#1f2937",
    },
    tripDate: {
      margin: "0.25rem 0 0 0",
      fontSize: "0.875rem",
      color: "#6b7280",
    },
  }

  return (
    <div style={styles.container}>
      {/* 1. 헤더 */}
      <header style={styles.header}>
        <h1 style={styles.title}>환영합니다, 여행자님!</h1>
        <p style={styles.description}>오늘 어떤 여행을 계획해 볼까요?</p>

        <div style={styles.buttonGroup}>
          <button style={{ ...styles.btn, ...styles.btnPrimary }}>
            <i className="fa-solid fa-plus"></i> 새 여행 만들기
          </button>
          <button style={{ ...styles.btn, ...styles.btnSecondary }}>
            <i className="fa-regular fa-image"></i> 앨범 이동
          </button>
        </div>
      </header>

      {/* 2. 여행 요약 (카드) */}
      <section>
        <h2 style={styles.sectionTitle}>여행 요약</h2>
        <div style={styles.grid}>
          {/* 카드 1 */}
          <div style={styles.card}>
            <div style={styles.cardTop}>
              <div style={styles.iconBox}>
                <div style={{ ...styles.iconCircle, ...styles.bgGreenLight }}>
                  <i className="fa-solid fa-plane"></i>
                </div>
                <span style={{ fontWeight: 500, color: "#4b5563" }}>
                  진행 중인 여행
                </span>
              </div>
              <span
                style={{
                  fontSize: "1.5rem",
                  fontWeight: 700,
                  ...styles.textGreen,
                }}
              >
                2
              </span>
            </div>
            <p style={{ fontSize: "0.875rem", color: "#9ca3af", margin: 0 }}>
              현재 진행 중인 여행이 있습니다.
            </p>
          </div>

          {/* 카드 2 */}
          <div style={styles.card}>
            <div style={styles.cardTop}>
              <div style={styles.iconBox}>
                <div style={{ ...styles.iconCircle, ...styles.bgOrangeLight }}>
                  <i className="fa-regular fa-bell"></i>
                </div>
                <span style={{ fontWeight: 500, color: "#4b5563" }}>
                  다가오는 일정
                </span>
              </div>
              <span
                style={{
                  fontSize: "1.5rem",
                  fontWeight: 700,
                  ...styles.textOrange,
                }}
              >
                3
              </span>
            </div>
            <p style={{ fontSize: "0.875rem", color: "#9ca3af", margin: 0 }}>
              곧 시작할 여행이 있습니다.
            </p>
          </div>

          {/* 새 여행 추가 버튼 */}
          <div style={styles.card}>
            <div style={styles.cardTop}>
              <div style={styles.iconBox}>
                <div style={{ ...styles.iconCircle, ...styles.bgGreenLight }}>
                  <i className="fa-solid fa-plane"></i>
                </div>
                <span style={{ fontWeight: 500, color: "#4b5563" }}>
                  완료된 여행
                </span>
              </div>
              <span
                style={{
                  fontSize: "1.5rem",
                  fontWeight: 700,
                  ...styles.textGreen,
                }}
              >
                2
              </span>
            </div>
            <p style={{ fontSize: "0.875rem", color: "#9ca3af", margin: 0 }}>
              완료된 여행
            </p>
          </div>
        </div>
      </section>

      {/* 3. 최근 일정 리스트 */}
      <section>
        <h2 style={styles.sectionTitle}>최근 일정</h2>
        <div style={styles.tripList}>
          {recentTrips.map((trip) => (
            <div key={trip.id} style={styles.tripItem}>
              <div style={styles.tripInfo}>
                <div style={styles.tripThumb}>
                  <img src={trip.imgUrl} alt={trip.title} style={styles.img} />
                </div>
                <div>
                  <h3 style={styles.tripTitle}>{trip.title}</h3>
                  <p style={styles.tripDate}>
                    {trip.location} · {trip.date}
                  </p>
                </div>
              </div>
              <i
                className="fa-solid fa-chevron-right"
                style={{ color: "#d1d5db" }}
              ></i>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

export default Main
