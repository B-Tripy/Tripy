import "./Recommend.css";

const RECOMMEND_LIST = [
  {
    id: 1,
    city: "도쿄",
    country: "일본",
    tags: ["도시형", "문화", "쇼핑"],
    reasonTitle: "현대와 전통이 조화를 이루는 도시",
    reasonDesc:
      "첨단 기술과 전통 문화가 공존하며 다양한 먹거리와 쇼핑을 즐길 수 있습니다.",
    duration: "3~5일",
    season: "3~5월, 9~11월",
    budget: "150~200만원",
  },
  {
    id: 2,
    city: "파리",
    country: "프랑스",
    tags: ["문화", "예술", "로맨틱"],
    reasonTitle: "로맨틱한 예술과 문화의 중심지",
    reasonDesc:
      "에펠탑, 루브르 박물관 등 세계적인 명소가 가득한 낭만의 도시입니다.",
    duration: "4~6일",
    season: "4~6월, 9~10월",
    budget: "200~300만원",
  },
  {
    id: 3,
    city: "산토리니",
    country: "그리스",
    tags: ["휴양", "자연", "감성"],
    reasonTitle: "에게해의 가장 아름다운 섬",
    reasonDesc:
      "푸른 바다와 하얀 건축물이 어우러진 환상적인 풍경을 경험할 수 있습니다.",
    duration: "3~5일",
    season: "4~10월",
    budget: "250~350만원",
  },
];

const Recommend = () => {
  return (
    <div className="recommend container">
      <h2 className="recommend-title">여행지 추천</h2>
      <p className="recommend-sub">
        AI가 추천하는 인기 여행지를 확인해보세요
      </p>

      <div className="recommend-list">
        {RECOMMEND_LIST.map((item) => (
          <div key={item.id} className="recommend-card">
            {/* 제목 */}
            <div className="card-header">
              <h3>
                {item.city}, {item.country}
              </h3>
              <div className="tags">
                {item.tags.map((tag) => (
                  <span key={tag} className="tag">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* 추천 이유 */}
            <div className="card-reason">
              <strong className="reason-title">{item.reasonTitle}</strong>
              <p className="reason-desc">{item.reasonDesc}</p>
            </div>

            {/* 정보 */}
            <div className="card-info">
              <span>📅 추천 기간: {item.duration}</span>
              <span>🌸 베스트 시즌: {item.season}</span>
              <span>💰 예상 비용: {item.budget}</span>
            </div>

            {/* 버튼 */}
            <div className="card-actions">
              <button className="btn btn-outline-success">
                ⭐ 즐겨찾기에 추가
              </button>
              <button className="btn btn-success">
                🗓 이 여행으로 계획 세우기
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Recommend;
