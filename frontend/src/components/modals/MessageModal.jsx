import { useMessageStore } from "../../store/messageStore";
import styles from "./MessageModal.module.css";

const MessageModal = () => {
  const { latestMessage, clearLatest } = useMessageStore();

  if (!latestMessage) return null; // 메시지가 없으면 모달 숨김

  const confirm = () => {
    clearLatest();
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
          <p>{latestMessage.text}</p>
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
