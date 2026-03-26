import { WebSocketServer } from "ws";

export function createSocketServer(server, authService) {
  const wss = new WebSocketServer({ server, path: "/ws" });

  wss.on("connection", (socket, request) => {
    const url = new URL(request.url, "http://localhost");
    const token = url.searchParams.get("token");
    const session = token ? authService.getSession(token) : null;

    if (!session) {
      socket.close(1008, "Unauthorized");
      return;
    }

    socket.send(JSON.stringify({ type: "connected" }));
  });

  return {
    broadcast(event, payload) {
      const message = JSON.stringify({ type: event, payload });
      for (const client of wss.clients) {
        if (client.readyState === 1) {
          client.send(message);
        }
      }
    }
  };
}
