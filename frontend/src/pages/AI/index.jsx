import axios from "axios";
import { useState } from "react";
import Loading from "../../components/Loading";
const Ai = () => {
  // const [topic, setTopic] = useState({});

  // const onChange = (e) => {
  //   const { name, value } = e.target;
  //   setTopic[name] = value;
  // };
  const [poem, setPoem] = useState(null);
  const [loading, setLoading] = useState(false);

  const sendRequest = async () => {
    alert("보내고 받기");
    setLoading(true);
    await axios
      .post("http://127.0.0.1:8000/ai/poem", { topic: "독감", style: "현대" })
      .then((res) => {
        console.log(res.data);
        setPoem(res.data.summary);
        setLoading(false);
      })
      .catch((e) => {
        console.error(e);
      });
  };
  return (
    <div>
      <div className="album container" style={{ display: "flex" }}>
        <div style={{ marginRight: "10px" }}>
          <div
            style={{
              width: "250px",

              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <label>제목</label>
            <input type="text" id="title"></input>
          </div>
          <div
            style={{
              width: "250px",

              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <label>스타일</label>
            <input type="text"></input>
          </div>
        </div>
        <button
          style={{ background: "#88ac73", color: "#333", cursor: "pointer" }}
          onClick={sendRequest}
        >
          전송
        </button>
      </div>
      <div style={{ margin: "100px" }}>
        <textarea value={poem} rows="40" cols="40"></textarea>
      </div>
      {loading && <Loading />}
    </div>
  );
};

export default Ai;
