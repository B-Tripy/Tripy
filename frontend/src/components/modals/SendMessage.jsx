import { useState, useEffect, useContext } from "react";
import socket from "../../socket";
import { ValueContext } from "../../context/ValueContext";
import axios from "axios";
import { Reset } from "../../context/ValueContext";
import { useAuthStore } from "../../store/authStore";
export default function SendMessage() {
  const [toUserEmail, setToUserEmail] = useState("");
  const [text, setText] = useState("");
  const { user } = useAuthStore(); // 검색이 허용된  user들 가져오기
  const [visible, setVisible] = useState(false);
  const { value } = useContext(ValueContext);
  const { setReset } = useContext(Reset);
  useEffect(() => {
    // delivery_status 이벤트는 컴포넌트가 마운트될 때 한 번만 등록
    socket.on("delivery_status", (status) => {
      if (status.ok) {
        alert("메시지 전송 성공!");
      } else {
        alert("전송 실패: " + status.reason);
      }
    });

    return () => {
      socket.off("delivery_status"); // 언마운트 시 정리
    };
  }, []);
  useEffect(() => {
    if (value.tripId) {
      // 메시지가 생기면 모달을 먼저 렌더링하고
      // 다음 tick에서 show 클래스를 붙여 transition 실행
      setVisible(true);
    } else {
      setVisible(false);
    }
    // setValue({ tripId: 0, tripTitle: "", own: true });
  }, [value]);
  const sendMessage = () => {
    console.log("emit 실행:", toUserEmail, value.tripId, value.tripTitle, text);
    socket.emit("send_to_user", {
      toUserEmail,
      tripId: value.tripId,
      tripTitle: value.tripTitle,
      text,
    });
  };
  const withdraw = async () => {
    console.log("user", user.id);
    try {
      const res = await axios.post("/api/companion/withdraw", {
        tripId: value.tripId,
        userId: user.id,
      });

      setReset(res.data.success); //Review화면 갱신
      console.log("res.data", res.data, "messages", messages);
    } catch (e) {
      console.error(e);
    }
  };
  const closeForm = () => {
    setVisible(false);
  };
  return (
    <div className={`sendMessage ${visible ? "show" : ""}`}>
      <h4 style={{ fontSize: "1.2rem" }}>
        <b>
          {/* {value.tripId}  */}
          {value.tripTitle}
        </b>
        <span> </span>
        {value.own ? "동행 요청" : "동행 취소"}
      </h4>
      {value.own ? (
        <div
          className="inputs"
          style={{
            minHeight: "200px",
            width: "100%",
          }}
        >
          <input
            style={{
              padding: "5px",
              borderRadius: "8px",
              border: "none",
              paddingLeft: ".7rem",
              // background: "transparent",
              // borderBottom: "1px solid white",
              // color: "white",
            }}
            placeholder="받는 유저 Email"
            value={toUserEmail}
            onChange={(e) => setToUserEmail(e.target.value)}
          />
          <label>
            <input type="checkbox" style={{ margin: "10px" }}></input>
            확인
          </label>
        </div>
      ) : (
        <div
          className="inputs"
          style={{
            minHeight: "200px",
            width: "100%",
          }}
        >
          {/* <input
            style={{
              padding: "5px",
              borderRadius: "8px",
              border: "none",
              paddingLeft: ".7rem",
              // background: "transparent",
              // borderBottom: "1px solid white",
              // color: "white",
            }}
            placeholder="받는 유저 Email"
            value={toUserEmail}
            onChange={(e) => setToUserEmail(e.target.value)}
          />
          <label>
            <input type="checkbox" style={{ margin: "10px" }}></input>
            확인
          </label> */}
        </div>
      )}

      <div
        className="button"
        style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}
      >
        {value.own ? (
          <button onClick={sendMessage}>{value.own ? "보내기" : "확인"}</button>
        ) : (
          <button onClick={() => withdraw()}>
            {value.own ? "보내기" : "확인"}
          </button>
        )}
        <button onClick={closeForm}>닫기</button>
      </div>
    </div>
  );
}
