import { io } from "socket.io-client";
import { useMessageStore } from "./store/messageStore";

const socket = io(import.meta.env.VITE_BACKEND_URL || "/api", {
  withCredentials: true,
  transports: ["websocket"],
  reconnection: true, // 연결 끊기면 자동 재시도
  autoConnect: false,
  // reconnectionAttempts: 10, // 최대 10번 시도
  // reconnectionDelay: 1000, // 1초 간격으로 시도
});
socket.on("connect", () => {
  console.log("소켓 연결 성공", socket.id);
});
socket.on("incoming_message", (msg) => {
  console.log("msg", msg);
  useMessageStore.getState().addMessage(msg);
});
export default socket;
