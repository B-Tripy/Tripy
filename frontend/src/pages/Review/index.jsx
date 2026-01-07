import React, { useState } from "react"
import {
  LayoutDashboard,
  Map,
  PenTool,
  Eye,
  MapPin,
  Image as ImageIcon,
  BarChart3,
  LogOut,
  Search,
  Save,
  Edit2,
} from "lucide-react"

const DashBoard = () => {
  // 상태 관리: 저장된 리뷰 리스트
  const [reviews, setReviews] = useState([
    {
      id: 1,
      day: 1,
      text: "첫째 날 여행은 정말 즐거웠습니다. 날씨가 맑아서 사진이 잘 나왔네요.",
      image: null,
    },
  ])

  // 상태 관리: 현재 작성 중인 입력값
  const [inputText, setInputText] = useState("")
  const [nextDay, setNextDay] = useState(2) // 다음 일차 자동 계산

  // 저장 버튼 핸들러
  const handleSave = () => {
    if (!inputText.trim()) return alert("내용을 입력해주세요.")

    const newReview = {
      id: Date.now(),
      day: nextDay,
      text: inputText,
      image: null, // 실제 구현 시 이미지 URL 처리 필요
    }

    setReviews([...reviews, newReview])
    setInputText("")
    setNextDay(nextDay + 1)
  }

  return (
    <div className="flex h-screen w-full bg-gray-50 font-sans text-gray-800">
      {/* 1. 왼쪽 사이드바 (네비게이션) */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col justify-between hidden md:flex">
        <div>
          {/* 로고 영역 */}
          <div className="p-6 flex items-center justify-center border-b border-gray-100">
            <div className="text-2xl font-bold text-green-600 tracking-tighter">
              TRIPY
            </div>
          </div>

          {/* 메뉴 리스트 */}
          <nav className="mt-6 px-4 space-y-2">
            <NavItem icon={<LayoutDashboard size={20} />} label="대시보드" />
            <NavItem icon={<Map size={20} />} label="여행 계획" />
            <NavItem icon={<PenTool size={20} />} label="리뷰 쓰기" active />
            <NavItem icon={<Eye size={20} />} label="리뷰 보기" />
            <NavItem icon={<MapPin size={20} />} label="여행 추천" />
            <NavItem icon={<ImageIcon size={20} />} label="앨범" />
            <NavItem icon={<BarChart3 size={20} />} label="여행 감성 분석" />
          </nav>
        </div>

        <div className="p-4 border-t border-gray-100">
          <button className="flex items-center gap-3 text-gray-500 hover:text-red-500 transition-colors px-4 py-2 w-full">
            <LogOut size={20} />
            <span>로그아웃</span>
          </button>
        </div>
      </aside>

      {/* 2. 메인 컨텐츠 (가운데) */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto p-8">
          {/* 페이지 타이틀 */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-8 text-center">
            <h1 className="text-2xl font-bold text-gray-800">여행 리뷰 작성</h1>
          </div>

          {/* 입력 폼 (작성 영역) */}
          <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 mb-12 relative ring-2 ring-green-50">
            <div className="absolute top-0 left-0 bg-green-600 text-white text-xs font-bold px-3 py-1 rounded-br-lg rounded-tl-lg">
              {nextDay}일차 작성 중
            </div>

            <div className="flex flex-col md:flex-row gap-6 mt-4">
              {/* 사진 탐색 버튼 영역 */}
              <div className="w-full md:w-1/4 h-40 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center hover:bg-gray-100 cursor-pointer transition-colors group">
                <Search
                  className="text-gray-400 group-hover:text-green-600 mb-2"
                  size={32}
                />
                <span className="text-sm text-gray-500 font-medium">
                  사진 탐색
                </span>
                <span className="text-xs text-gray-400 mt-1">
                  (Node 서버 탐색)
                </span>
              </div>

              {/* 텍스트 입력 영역 */}
              <div className="flex-1">
                <textarea
                  className="w-full h-40 p-4 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                  placeholder={`${nextDay}일차 여행 내용을 입력하세요...`}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                />
              </div>
            </div>

            {/* 저장 버튼 */}
            <div className="flex justify-end mt-4">
              <button
                onClick={handleSave}
                className="flex items-center gap-2 bg-orange-400 hover:bg-orange-500 text-white px-6 py-2 rounded-lg font-medium shadow-sm transition-colors"
              >
                <Save size={18} />글 저장
              </button>
            </div>
          </div>

          {/* 화살표 아이콘 (흐름 표시) */}
          <div className="flex justify-center mb-8 text-gray-300">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <polyline points="19 12 12 19 5 12"></polyline>
            </svg>
          </div>

          {/* 리스트 영역 (저장된 내용) */}
          <div className="space-y-6">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-lg text-gray-700">
                    {review.day}일차
                  </h3>
                  <div className="text-xs text-gray-400">저장됨</div>
                </div>

                <div className="flex flex-col md:flex-row gap-6">
                  {/* 저장된 사진 영역 */}
                  <div className="w-full md:w-1/4 h-32 bg-gray-100 rounded-lg flex items-center justify-center">
                    <ImageIcon className="text-gray-400" size={32} />
                    <span className="ml-2 text-sm text-gray-500">사진</span>
                  </div>

                  {/* 저장된 텍스트 영역 */}
                  <div className="flex-1 p-4 bg-gray-50 rounded-lg text-gray-700 whitespace-pre-wrap">
                    {review.text}
                  </div>
                </div>

                {/* 수정 버튼 */}
                <div className="flex justify-end mt-4">
                  <button className="flex items-center gap-2 text-gray-500 hover:text-green-600 border border-gray-200 hover:border-green-600 px-4 py-1.5 rounded-lg text-sm transition-colors">
                    <Edit2 size={16} />
                    수정 버튼
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* 3. 오른쪽 사이드바 (AI 요약) */}
      <aside className="w-72 bg-white border-l border-gray-200 hidden xl:flex flex-col p-6">
        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-800 mb-2">
            여행 계획 초안 AI 요약
          </h2>
          <p className="text-xs text-gray-500">
            작성된 리뷰들을 바탕으로 AI가 요약해줍니다.
          </p>
        </div>

        <button className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-bold shadow-md transition-colors mb-6">
          AI 요약 생성
        </button>

        <div className="flex-1 bg-gray-50 rounded-lg p-4 text-sm text-gray-600 border border-gray-100">
          <p className="mb-4">
            <strong>AI 요약 결과:</strong>
          </p>
          <p className="leading-relaxed">
            아직 요약된 내용이 없습니다. 왼쪽에서 여행 리뷰를 작성하고 저장한
            뒤, 상단의 'AI 요약 생성' 버튼을 눌러보세요.
          </p>
        </div>
      </aside>
    </div>
  )
}

// 네비게이션 아이템 컴포넌트
const NavItem = ({ icon, label, active = false }) => (
  <div
    className={`flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition-colors ${
      active
        ? "bg-green-600 text-white shadow-md"
        : "text-gray-600 hover:bg-gray-100"
    }`}
  >
    {icon}
    <span className="font-medium text-sm">{label}</span>
  </div>
)

export default DashBoard
