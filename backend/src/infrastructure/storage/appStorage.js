import { createRedisClient } from "../../config/redis.js";
import { createSeedState } from "../../shared/seed.js";

const STATE_KEY = "rehabcare:app-state";

export class AppStorage {
  constructor() {
    this.memoryState = createSeedState();
    this.redis = createRedisClient();
    this.mode = "memory";
  }

  async init() {
    try {
      await this.redis.connect();
      const existing = await this.redis.get(STATE_KEY);
      if (!existing) {
        await this.redis.set(STATE_KEY, JSON.stringify(this.memoryState));
      }
      this.mode = "redis";
    } catch {
      this.mode = "memory";
    }
  }

  async readState() {
    if (this.mode === "redis") {
      const raw = await this.redis.get(STATE_KEY);
      return raw ? JSON.parse(raw) : createSeedState();
    }
    return this.memoryState;
  }

  async writeState(nextState) {
    if (this.mode === "redis") {
      await this.redis.set(STATE_KEY, JSON.stringify(nextState));
      return;
    }
    this.memoryState = nextState;
  }
}
