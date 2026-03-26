import express from "express";
import http from "node:http";
import { env } from "./config/env.js";
import { AppService } from "./domain/appService.js";
import { AuthService } from "./domain/authService.js";
import { AppStorage } from "./infrastructure/storage/appStorage.js";
import { createAuthMiddleware } from "./middleware/authMiddleware.js";
import { errorMiddleware } from "./middleware/errorMiddleware.js";
import { createSocketServer } from "./realtime/socketServer.js";
import { createAuthRoutes } from "./routes/authRoutes.js";
import { createChatRoutes } from "./routes/chatRoutes.js";
import { createWorkspaceRoutes } from "./routes/workspaceRoutes.js";

const app = express();
const server = http.createServer(app);
const storage = new AppStorage();
const authService = new AuthService();
const realtime = createSocketServer(server, authService);
const service = new AppService(storage, realtime);

app.use(express.json());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
  if (req.method === "OPTIONS") {
    res.sendStatus(204);
    return;
  }
  next();
});

app.get("/health", async (_req, res) => {
  const state = await storage.readState();
  res.json({ ok: true, storage: storage.mode, patients: state.patients.length, threads: state.threads.length });
});

app.use("/auth", createAuthRoutes(service, authService));
app.use("/workspace", createAuthMiddleware(authService), createWorkspaceRoutes(service));
app.use("/chat", createAuthMiddleware(authService), createChatRoutes(service));
app.use(errorMiddleware);

await storage.init();

server.listen(env.port, () => {
  console.log(`RehabCare backend listening on http://localhost:${env.port}`);
});
