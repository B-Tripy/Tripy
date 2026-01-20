import React, { useState } from "react";
import axios from "axios";
// const API_URL = import.meta.env.VITE_API_URL || "/api";

const Temp = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  // 1. 파일 선택 핸들러
  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };
  // 2. 서버 전송 핸들러
  const handleUpload = async () => {
    // console.log(API_URL);
    if (!selectedFile) {
      alert("사진을 먼저 선택해주세요!");
      return;
    }
    const formData = new FormData();
    formData.append("file", selectedFile);
    try {
      setIsLoading(true);
      // 이전 결과 초기화 (새로운 요청 시 화면 깜빡임 방지)
      setResult(null);

      const res = await axios.post(
        "http://localhost:5000/api/upload",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        },
      );

      console.log("서버 응답:", res.data);
      setResult(res.data);

      // -------------------------------------------------------
      // [수정 포인트 1] 중복 여부에 따른 알림 분기 처리
      // -------------------------------------------------------
      if (res.data.isDuplicate) {
        alert(":경고: 이미 존재하는 파일입니다.");
      } else {
        alert(":흰색_확인_표시: 업로드 및 AI 분석 완료!");
      }
    } catch (error) {
      console.error("에러 발생:", error);
      alert("업로드 실패. 콘솔을 확인해주세요.");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="review container" style={{ padding: "20px" }}>
      <div style={{ height: "200px", width: "100%" }}></div>
      <h2>:플래시가_깜박이는_카메라: 임시 사진 업로드 테스트</h2>
      {/* 파일 입력 */}
      <div style={{ margin: "20px 0" }}>
        <input type="file" onChange={handleFileChange} accept="image/*" />
      </div>
      {/* 저장 버튼 */}
      <button
        onClick={handleUpload}
        disabled={isLoading}
        style={{ padding: "10px 20px", fontSize: "16px" }}
      >
        {isLoading ? "AI 분석중..." : "저장 및 분석 시작"}
      </button>
      {/* 결과 출력 영역 */}
      {result && (
        <div
          style={{
            marginTop: "30px",
            border: "1px solid #ddd",
            padding: "20px",
            borderRadius: "8px",
            backgroundColor: result.isDuplicate ? "#FFF4E5" : "#F0FDF4", // 중복이면 살구색, 성공이면 연두색 배경
          }}
        >
          {/* -------------------------------------------------------
              [수정 포인트 2] 중복일 때와 아닐 때 화면 표시 다르게
             ------------------------------------------------------- */}
          {result.isDuplicate ? (
            // 중복일 경우 표시할 화면
            <div>
              <h3 style={{ color: "#D32F2F" }}>
                :경고: 이미 저장된 사진입니다
              </h3>
              <p>
                <strong>DB 저장 ID:</strong> {result.photoId}
              </p>
            </div>
          ) : (
            // 정상 업로드일 경우 표시할 화면
            <div>
              <h3 style={{ color: "#2E7D32" }}>:흰색_확인_표시: 분석 완료</h3>
              <p>
                <strong>DB 저장 ID:</strong> {result.photoId}
              </p>
              <h4>AI 카테고리 예측:</h4>
              <ul>
                {result.results.map((item, index) => (
                  <li key={index}>
                    {item.category} (확률: {(item.score * 100).toFixed(1)}%)
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
export default Temp;
