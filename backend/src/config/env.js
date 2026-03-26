export const env = {
  port: Number(process.env.PORT || 4010),
  redisUrl: process.env.REDIS_URL || "redis://127.0.0.1:6379"
};
