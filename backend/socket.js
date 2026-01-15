const userSockets = new Map(); // email -> Set(socketId)

function addUserSocket(email, socketId) {
  if (!userSockets.has(email)) userSockets.set(email, new Set());
  userSockets.get(email).add(socketId);
}

function removeUserSocket(email, socketId) {
  if (!userSockets.has(email)) return;
  const set = userSockets.get(email);
  set.delete(socketId);
  if (set.size === 0) userSockets.delete(email);
}

function registerSocketHandlers(io) {
  io.on("connection", (socket) => {
    const user = socket.request.user;
    if (!user || !user.email) return;

    const email = user.email;
    const nick = user.nickname;

    // 1. 연결 시 Map에 등록 (중복 방지를 위해 Set 사용)
    if (!userSockets.has(email)) {
      userSockets.set(email, new Set());
    }
    userSockets.get(email).add(socket.id);

    console.log(
      `✅ [연결] ${email} | 현재 소켓 수: ${userSockets.get(email).size}`
    );

    socket.on("send_to_user", ({ toUserEmail, tripId, tripTitle, text }) => {
      const targets = userSockets.get(toUserEmail);

      console.log(`서버에서 ${toUserEmail}로 발송 시도. 찾은 소켓:`, targets);

      if (targets && targets.size > 0) {
        targets.forEach((sid) => {
          io.to(sid).emit("incoming_message", {
            fromUserEmail: email,
            tripId: tripId,
            tripTitle: tripTitle,
            text,
            at: Date.now(),
          });
        });
      } else {
        console.log(`❌ ${toUserEmail}는 현재 찾을 수 없음 (undefined 상태)`);
      }
    });

    // 2. 연결 해제 시 정확히 제거
    socket.on("disconnect", () => {
      const sids = userSockets.get(email);
      if (sids) {
        sids.delete(socket.id);
        if (sids.size === 0) {
          userSockets.delete(email);
        }
      }
      console.log(`Logout: ${email}, 남은 소켓: ${sids ? sids.size : 0}`);
    });
  });
}

module.exports = registerSocketHandlers;
