import { useEffect, useState } from "react";
import { useMessageStore } from "../../store/messageStore";
import { useAuthStore } from "../../store/authStore";
import styles from "./MessageModal.module.css";
import axios from "axios";

const MessageModal = () => {
  const { user } = useAuthStore();
  const { messages, latestMessage, clearLatest } = useMessageStore();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (latestMessage) {
      // 메시지가 생기면 모달을 먼저 렌더링하고
      // 다음 tick에서 show 클래스를 붙여 transition 실행
      setVisible(true);
    } else {
      setVisible(false);
    }
  }, [latestMessage]);

  if (!latestMessage) return null;

  const confirm = async () => {
    clearLatest();
    try {
      const res = await axios.post("/api/companion", {
        tripId: latestMessage.tripId,
        userId: user.id,
      });
      console.log("res.data", res.data, "messages", messages);
    } catch (e) {
      console.error(e);
    }
  };

  const hold = () => {
    clearLatest();
  };

  return (
    <div className={`messageModal ${visible ? "show" : ""}`}>
      <div className={styles.backdrop}>
        <div className={styles.modal}>
          <h3>새 메세지 도착</h3>
          <p>
            <b>보낸사람:</b> {latestMessage.fromUserEmail}
          </p>
          <p>{latestMessage.tripTitle}</p>
          <div className={styles.buttons}>
            <button onClick={confirm}>수락</button>
            <button onClick={hold}>보류</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageModal;
