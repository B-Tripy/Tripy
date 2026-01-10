import { useState } from "react";
import { useMessageStore } from "../../store/messageStore";
import styles from "./MessageModal.module.css";
const MessageModal = () => {
  const { latestMessage, clearLatest } = useMessageStore();
  const [show, setShow] = useState(true);
  const confirm = () => {
    clearLatest();
    setShow(false);
  };
  const hold = () => {
    clearLatest();
    setShow(false);
  };
  if (!latestMessage) return null;

  return (
    <div className={`messageModal ${latestMessage || show ? "show" : ""}`}>
      <div className={styles.backdrop}>
        <div className={styles.modal}>
          <h3>새 메세지 도착</h3>
          <p>
            <b>보낸사람:</b>
            {/* {latestMessage.fromUser} */}
          </p>
          {/* <p>{latestMessage.text}</p> */}
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
