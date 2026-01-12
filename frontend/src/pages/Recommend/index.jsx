import { useEffect, useState } from "react";
import "./Recommend.css";

const Recommend = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRecommendations() {
      setLoading(true);
      try {
        const res = await fetch("http://localhost:8000/ai/recommend", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ count: 3 }),
        });

        const data = await res.json();
        console.log("API 응답:", data); // 디버깅용

        // ✅ 핵심 수정
        setRecommendations(data.recommendations || []);
      } catch (error) {
        console.error("추천 데이터 로드 실패:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchRecommendations();
  }, []);

  if (loading) {
    return <p className="loading">AI 추천 여행지를 불러오는 중...</p>;
  }

  return (
    <div className="recommend container">
      <h2 className="recommend-title">여행지 추천</h2>
      <p className="recommend-sub">
        AI가 추천하는 인기 여행지를 확인해보세요
      </p>

      <div className="recommend-list">
        {recommendations.map((item, index) => (
          <div key={index} className="recommend-card">
            <div className="card-header">
              <h3>{item.title}</h3>
            </div>

            <div className="card-reason">
              <strong className="reason-title">추천 이유</strong>
              <p className="reason-desc">{item.reason}</p>
            </div>

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
