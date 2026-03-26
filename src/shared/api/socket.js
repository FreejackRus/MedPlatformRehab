const WS_URL = import.meta.env.VITE_WS_URL || "ws://localhost:4010/ws";

export function connectSocket(token, onMessage) {
  const socket = new WebSocket(`${WS_URL}?token=${encodeURIComponent(token)}`);

  socket.addEventListener("message", (event) => {
    try {
      const payload = JSON.parse(event.data);
      onMessage(payload);
    } catch {
      // ignore malformed message
    }
  });

  return socket;
}
