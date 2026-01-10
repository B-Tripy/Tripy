// src/components/SendMessage.jsx
import { useState } from "react";
import socket from "../../socket";

export default function SendMessage() {
  const [toUserEmail, setToUserEmail] = useState("");
  const [text, setText] = useState("");

  const sendMessage = () => {
    socket.emit("send_to_user", { toUserEmail, text });
  };

  return (
    <div>
      <h3>메시지 보내기</h3>
      <input
        placeholder="받는 유저 Email"
        value={toUserEmail}
        onChange={(e) => setToUserEmail(e.target.value)}
      />
      <input
        placeholder="메시지 내용"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button onClick={sendMessage}>보내기</button>
    </div>
  );
}
