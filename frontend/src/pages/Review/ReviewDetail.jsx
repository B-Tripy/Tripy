import { useParams, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import axios from "axios"
import Loading from "../../components/Loading"
import styles from "./ReviewDetail.module.scss"

const API_URL = import.meta.env.VITE_API_URL || "/api"
const instance = axios.create({ withCredentials: true })

function ReviewDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)

  // 상태 관리: 프롬프트, 이미지별 설명, AI 요약 결과
  const [prompt, setPrompt] = useState("")
  const [descriptions, setDescriptions] = useState({})
  const [aiSummary, setAiSummary] = useState("")

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await instance.get(`${API_URL}/review/${id}`)
        setPost(res.data)

        // 만약 기존에 작성된 설명 데이터가 있다면 초기화
        if (res.data.imageDescriptions) {
          setDescriptions(res.data.imageDescriptions)
        }
      } catch (e) {
        console.error("상세 데이터 로딩 실패:", e)
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

  // 각 사진 설명 핸들러
  const handleSaveIndividual = async (imgId) => {
    try {
      // 개별 사진 설명 저장 API 호출 (가정)
      await instance.post(`${API_URL}/review/${id}/descriptions/${imgId}`, {
        post: descriptions[imgId] || "", // 'description'을 'post'로 변경
      })
      alert(`사진 ${imgId} 설명이 저장되었습니다.`)
    } catch (e) {
      console.error("저장 실패:", e)
      alert("저장 실패")
    }
  }

  const handleEdit = (imgId) => {
    // 이미 편집 중이므로, 추가 로직 없음
  }

  const handleDelete = (imgId) => {
    setDescriptions((prev) => {
      const newDesc = { ...prev }
      delete newDesc[imgId]
      return newDesc
    })
  }

  // 전체 저장 핸들러
  const handleSave = async () => {
    try {
      // 1. 모든 사진 설명을 하나로 합치기 (혹은 요약본을 저장)
      const combinedContent = Object.values(descriptions).join("\n\n")

      // 2. 서버의 PUT 라우터 호출
      await instance.put(`${API_URL}/review/${id}/content`, {
        content: combinedContent,
      })

      alert("DB에 성공적으로 저장되었습니다.")
    } catch (e) {
      console.error("저장 실패:", e)
      alert("저장 중 오류가 발생했습니다.")
    }
  }

  // AI 요약 로직 (가상)
  const handleAiSummary = () => {
    const allTexts = Object.values(descriptions).join(" ")
    setAiSummary(`[AI 요약 결과]: ${allTexts.substring(0, 100)}...`)
  }

  if (loading) return <Loading />
  if (!post)
    return <div className={styles.container}>게시글을 찾을 수 없습니다.</div>

  return (
    <div className={styles.container}>
      {/* 1. 상단: AI 프롬프트 입력 영역 */}
      <header className={styles.promptSection}>
        <textarea
          placeholder="다른 작업자가 작업한 AI 프롬프트를 붙여넣는 곳"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
      </header>

      <main className={styles.mainContent}>
        <section className={styles.editorWrapper}>
          {/* 2. 중앙: 이미지 리스트 및 설명 입력창 */}
          <div className={styles.imageList}>
            {post.images?.map((img, index) => (
              <div key={img.id || index} className={styles.imageRow}>
                <div className={styles.imageBox}>
                  <img src={img.url} alt={`리뷰 이미지 ${index}`} />
                  <p className={styles.imgName}>
                    {img.name || `image_${index}.jpg`}
                  </p>
                </div>
                <div className={styles.textBox}>
                  <textarea
                    placeholder="사진 옆에 글 쓸 수 있는 박스"
                    value={descriptions[img.id] || ""}
                    onChange={(e) => handleDescChange(img.id, e.target.value)}
                  />
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
                </div>
              </div>
            ))}
          </div>

          {/* 3. 작성/수정/삭제 버튼 그룹 */}
        </section>

        {/* 4. 우측: AI 요약 영역 */}
        <aside className={styles.sideSummary}>
          <div className={styles.summaryDisplay}>
            {aiSummary || "박스에 있는 글들을 가져와서 AI 요약이 표시됩니다."}
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
