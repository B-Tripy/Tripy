import { useMessageStore } from "../../store/messageStore";
import { useAuthStore } from "../../store/authStore";
import styles from "./MessageModal.module.css";
import axios from "axios";
const MessageModal = () => {
  const { user } = useAuthStore();
  const { latestMessage, clearLatest } = useMessageStore();

  if (!latestMessage) return null; // 메시지가 없으면 모달 숨김

  const confirm = async () => {
    clearLatest();
    console.log("tripId", latestMessage.tripId, "userId", user.id);
    try {
      await axios.post("/api/companion", {
        tripId: latestMessage.tripId,
        userId: user.id,
      });
    } catch (e) {
      console.error(e);
    }
  };

  const hold = () => {
    clearLatest();
  };

  return (
    <div className={`messageModal show`}>
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
