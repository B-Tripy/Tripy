import { useParams } from "react-router-dom"

function ReviewDetail() {
  const { id } = useParams() // URL의 :id 값을 가져옴 (예: 1)

  const styles = {
    container: {
      maxWidth: "1152px",
      margin: "150px auto 2.5rem auto",
      padding: "2rem",
      fontFamily: "'Noto Sans KR', sans-serif",
    },
    header: {
      marginBottom: "2.5rem",
      marginTop: "150px",
    },
  }
  return (
    <div style={styles.container}>
      <div>
        <h2>게시글 상세 페이지</h2>
        <p>현재 보고 있는 게시글 번호: {id}</p>
        {/* 여기에 제목, 내용 등을 렌더링 */}
      </div>
    </div>
  )
}

export default ReviewDetail
