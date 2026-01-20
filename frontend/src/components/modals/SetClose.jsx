import { useState, useEffect } from "react";
import axios from "axios";

// 환경 변수 설정 (Vite 기준)
const API_URL = import.meta.env.VITE_API_URL || "/api";

const SetClose = ({ userId }) => {
  const [pickUser, setPickUser] = useState([]);

  const fetchUsers = async () => {
    try {
      const users = await axios.get(`${API_URL}/companion/getUsers`);
      // 데이터 안전하게 가져오기 (Optional Chaining)
      setPickUser(users.data?.users?.map((user) => user.id) ?? []);
    } catch (error) {
      console.error("사용자 목록 로딩 실패:", error);
    }
  };

  const handleToggle = async (e) => {
    // 1. 즉각적인 UI 반응을 위해 로컬 상태 먼저 업데이트 (Optimistic Update)
    const isChecked = e.target.checked;

    // UI 먼저 변경
    setPickUser((prev) =>
      isChecked ? [...prev, userId] : prev.filter((id) => id !== userId),
    );

    try {
      // 2. 서버 요청
      await axios.post(`${API_URL}/companion/toggle`, {
        userId,
        toggle: isChecked,
      });
      // 3. 확실하게 동기화 (필요하다면)
      await fetchUsers();
    } catch (error) {
      console.error("토글 실패:", error);
      // 에러 발생 시 원래대로 되돌리기 위해 다시 fetch
      fetchUsers();
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div style={{ userSelect: "none", marginLeft: "auto" }}>
      {/* 핵심 수정 사항:
         모든 요소를 <label> 안으로 넣었습니다.
         이제 이미지나 글자 어디를 눌러도 체크박스가 작동합니다.
      */}
      <label
        style={{
          cursor: "pointer",
          display: "flex", // Flexbox로 정렬
          alignItems: "center", // 수직 중앙 정렬
          gap: "10px", // 이미지와 텍스트 사이 간격
        }}
      >
        <input
          type="checkbox"
          checked={pickUser.includes(userId)}
          onChange={handleToggle}
          style={{ display: "none" }} // 체크박스 숨김
        />

        {/* 이미지가 라벨 안에 있으므로 클릭 가능 */}
        <img
          src={
            pickUser.includes(userId)
              ? "/assets/icons/toggle_on.png"
              : "/assets/icons/toggle_off.png"
          }
          width="60px"
          alt="toggle switch"
        />

        <span style={{ minWidth: "50px", textAlign: "left" }}>
          {pickUser.includes(userId) ? "공개" : "비공개"}
        </span>
      </label>
    </div>
  );
};

export default SetClose;
