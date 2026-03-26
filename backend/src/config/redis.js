import Redis from "ioredis";
import { env } from "./env.js";

export function createRedisClient() {
  const client = new Redis(env.redisUrl, {
    lazyConnect: true,
    maxRetriesPerRequest: 1,
    retryStrategy: null
  });

  // Silence connection-refused noise when Redis is not available and we fall back to memory mode.
  client.on("error", () => {});

  return client;
}
