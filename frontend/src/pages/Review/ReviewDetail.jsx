import { useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import axios from "axios"

const API_URL = import.meta.env.VITE_API_URL || "/api"
const instance = axios.create({ withCredentials: true })
function ReviewDetail() {
  const { id } = useParams()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await instance.get(`${API_URL}/review/${id}`)
        setPost(res.data)
      } catch (e) {
        console.error("상세 데이터 로딩 실패:", e)
      } finally {
        setLoading(false)
      }
    }
    fetchPost()
  }, [id])

  const styles = {
    container: {
      maxWidth: "1152px",
      margin: "150px auto 2.5rem auto",
      padding: "2rem",
      fontFamily: "'Noto Sans KR', sans-serif",
    },
    contentBox: {
      backgroundColor: "white",
      padding: "2rem",
      borderRadius: "1rem",
      border: "1px solid #f3f4f6",
      boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
    },
    title: { fontSize: "2rem", marginBottom: "1rem", color: "#111827" },
    meta: {
      color: "#6b7280",
      marginBottom: "2rem",
      borderBottom: "1px solid #eee",
      paddingBottom: "1rem",
    },
    description: { fontSize: "1.1rem", lineHeight: "1.6", color: "#374151" },
  }

  if (loading) return <div style={styles.container}>로딩 중...</div>
  if (!post)
    return <div style={styles.container}>게시글을 찾을 수 없습니다.</div>

  return (
    <div style={styles.container}>
      <div style={styles.contentBox}>
        <h2 style={styles.title}>{post.title}</h2>
        <div style={styles.meta}>
          <span>
            일정: {post.start_date.split("T")[0]} ~{" "}
            {post.end_date.split("T")[0]}
          </span>
          <span style={{ marginLeft: "1rem" }}>
            작성일: {new Date(post.createdAt).toLocaleDateString()}
          </span>
        </div>
        <div style={styles.description}>
          <p>{post.description}</p>
          {/* DB에 저장된 다른 필드(score 등)가 있다면 여기에 추가 */}
          <div style={{ marginTop: "20px", color: "#f59e0b" }}>
            평점: {"⭐".repeat(post.score || 0)}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ReviewDetail
