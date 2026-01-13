import { useState, useEffect, useContext } from "react";
import socket from "../../socket";
import { ValueContext } from "../../context/ValueContext";

export default function SendMessage() {
  const [toUserEmail, setToUserEmail] = useState("");
  const [text, setText] = useState("");
  // const { users } = useAuthStore(); // 검색이 허용된  user들 가져오기
  const [visible, setVisible] = useState(false);
  const { value } = useContext(ValueContext);
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
  }, [value.tripTitle]);
  const sendMessage = () => {
    console.log("emit 실행:", toUserEmail, value.tripId, value.tripTitle, text);
    socket.emit("send_to_user", {
      toUserEmail,
      tripId: value.tripId,
      tripTitle: value.tripTitle,
      text,
    });
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
        동행 요청
      </h4>
      <div
        className="inputs"
        style={{
          minHeight: "200px",
          width: "100%",
          // display: "flex",
          // justifyContent: "center",
          // alignItems: "flex-start",
          // background: "yellow",
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
        <input type="checkbox" style={{ margin: "10px" }}></input>
        {/* <input
          style={{
            padding: "5px",
            borderRadius: "4px",
            border: "none",
            paddingLeft: ".7rem",
          }}
          placeholder="받는 유저 Email"
          value={toUserEmail}
          onChange={(e) => setToUserEmail(e.target.value)}
        /> */}
        {/* <input
          placeholder="메시지 내용"
          value={text}
          onChange={(e) => setText(e.target.value)}
        /> */}
      </div>

      <div
        className="button"
        style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}
      >
        <button onClick={sendMessage}>보내기</button>
        <button onClick={closeForm}>닫기</button>
      </div>
    </div>
  );
}
