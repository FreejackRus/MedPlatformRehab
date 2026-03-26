import crypto from "node:crypto";

export class AuthService {
  constructor() {
    this.sessions = new Map();
  }

  createSession(subject) {
    const token = crypto.randomBytes(24).toString("hex");
    const session = {
      token,
      subject,
      createdAt: Date.now()
    };
    this.sessions.set(token, session);
    return session;
  }

  getSession(token) {
    return this.sessions.get(token) ?? null;
  }

  deleteSession(token) {
    this.sessions.delete(token);
  }
}
