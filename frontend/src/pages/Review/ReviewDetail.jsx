import { useParams, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import axios from "axios"
import Loading from "../../components/Loading"
import styles from "./ReviewDetail.module.scss"

const API_URL = import.meta.env.VITE_API_URL || "/api"
const IMG_BASE_URL = "http://localhost:5000"
const instance = axios.create({ withCredentials: true })

function ReviewDetail() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [currentUserId, setCurrentUserId] = useState(null)
  const [prompt, setPrompt] = useState("")
  const [descriptions, setDescriptions] = useState({})
  const [aiSummary, setAiSummary] = useState("")

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await instance.get(`${API_URL}/review/${id}`)
        setPost(res.data)

        // 서버에서 응답에 포함시켜준 현재 로그인 유저 ID 저장
        setCurrentUserId(res.data.currentUserId)

        // 기존 사진 설명 로드
        if (res.data.images) {
          const initialDesc = {}
          res.data.images.forEach((img) => {
            if (img.content) {
              initialDesc[img.id] = img.content
            }
          })
          setDescriptions(initialDesc)
        }
      } catch (e) {
        console.error("로딩 실패:", e)
      } finally {
        setLoading(false)
      }
    }
    fetchPost()
  }, [id])

  // 입력값 변경 핸들러
  const handleDescChange = (imgId, value) => {
    setDescriptions((prev) => ({ ...prev, [imgId]: value }))
  }

  // 개별 사진 설명 저장
  const handleSaveIndividual = async (imgId) => {
    try {
      // 입력한 descriptions[imgId] 값이 서버의 post 컬럼으로 들어갑니다.
      await instance.post(`${API_URL}/review/${id}/descriptions/${imgId}`, {
        post: descriptions[imgId] || "",
      })
      alert("내용이 성공적으로 업데이트되었습니다.")
    } catch (e) {
      if (e.response?.status === 403) {
        alert("본인이 작성한 글만 수정할 수 있습니다.")
      } else {
        alert("저장/수정 실패")
      }
    }
  }

  // 2. 수정 버튼 클릭 시 동작
  const handleEdit = (imgId) => {
    // 현재 구조에서는 저장 버튼과 동일한 역할을 수행하게 하거나,
    // 포커스를 주는 등의 UI 처리를 추가할 수 있습니다.
    handleSaveIndividual(imgId)
  }

  const handleDelete = (imgId) => {
    if (window.confirm("설명을 삭제하시겠습니까?")) {
      setDescriptions((prev) => {
        const newDesc = { ...prev }
        delete newDesc[imgId]
        return newDesc
      })
    }
  }

  const handleAiSummary = () => {
    const allTexts = Object.values(descriptions).join(" ")
    setAiSummary(`[AI 요약 결과]: ${allTexts.substring(0, 100)}...`)
  }

  if (loading) return <Loading />
  if (!post)
    return <div className={styles.container}>게시글을 찾을 수 없습니다.</div>

  return (
    <div className={styles.container}>
      {/* 1. 상단: 프롬프트 입력 영역 */}
      <header className={styles.promptSection}>
        <textarea
          placeholder="다른 작업자가 작업한 AI 프롬프트를 붙여넣는 곳"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
      </header>

      <main className={styles.mainContent}>
        {/* 2. 중앙: 이미지 리스트 (중복 태그 제거됨) */}
        <section className={styles.editorWrapper}>
          <div className={styles.imageList}>
            {post.images?.map((img, index) => {
              // 본인 확인 로직: 글이 없거나, 작성자가 나인 경우
              const imageUrl = img.url
                ? img.url.startsWith("http")
                  ? img.url
                  : `${IMG_BASE_URL}/${img.url.replace(/\\/g, "/")}` // /api가 아닌 5000포트로 직접 연결
                : ""
              const isMyPost = !img.authorId || img.authorId === currentUserId

              return (
                <div key={img.id || index} className={styles.imageRow}>
                  <div className={styles.imageBox}>
                    {/* 2. src 부분을 imageUrl로 변경 */}
                    <img src={imageUrl} alt={`리뷰 이미지 ${index}`} />
                  </div>

                  <div className={styles.textBox}>
                    <textarea
                      placeholder={
                        isMyPost
                          ? "사진 설명을 입력하세요."
                          : "다른 사용자가 작성한 글입니다."
                      }
                      value={descriptions[img.id] || ""}
                      onChange={(e) => handleDescChange(img.id, e.target.value)}
                      readOnly={!isMyPost}
                      className={!isMyPost ? styles.readOnlyTextarea : ""}
                    />

                    {/* 권한이 있을 때만 버튼 노출 */}
                    {isMyPost && (
                      <div className={styles.buttonGroup}>
                        <button
                          className={styles.btnBlue}
                          onClick={() => handleSaveIndividual(img.id)}
                        >
                          저장
                        </button>
                        <button
                          className={styles.btnGray}
                          onClick={() => handleEdit(img.id)}
                        >
                          수정
                        </button>
                        <button
                          className={styles.btnRed}
                          onClick={() => handleDelete(img.id)}
                        >
                          삭제
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* 3. 우측: AI 요약 영역 */}
        <aside className={styles.sideSummary}>
          <div className={styles.summaryDisplay}>
            {aiSummary || "이미지 설명을 기반으로 요약이 생성됩니다."}
          </div>
          <button className={styles.summaryBtn} onClick={handleAiSummary}>
            요약 버튼
          </button>
        </aside>
      </main>
    </div>
  )
}

export default ReviewDetail
