import io from "socket.io-client";
import { useMessageStore } from "./store/messageStore";

const socket = io("http://localhost:5000", {
  withCredentials: true,
  transports: ["websocket"],
});
socket.on("incomming_message", (msg) => {
  useMessageStore.getState().addMessage(msg);
});
export default socket;
