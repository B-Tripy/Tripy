import { useState, useEffect } from "react";
import socket from "../../socket";

export default function SendMessage({ tripId, tripTitle }) {
  const [toUserEmail, setToUserEmail] = useState("");
  const [text, setText] = useState("");

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

  const sendMessage = () => {
    console.log("emit 실행:", toUserEmail, tripId, tripTitle, text);
    socket.emit("send_to_user", { toUserEmail, tripId, tripTitle, text });
  };

  return (
    <div>
      {/* <p>
        {tripId} {tripTitle}동행요청
      </p> */}
      <input
        placeholder="받는 유저 Email"
        value={toUserEmail}
        onChange={(e) => setToUserEmail(e.target.value)}
      />
      {/* <input
        placeholder="메시지 내용"
        value={text}
        onChange={(e) => setText(e.target.value)}
      /> */}
      <button onClick={sendMessage}>보내기</button>
    </div>
  );
}
