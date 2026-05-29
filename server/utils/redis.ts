import Redis from "ioredis";

let client: Redis | null = null;

export function getRedis() {
  if (!client) {
    client = new Redis({
      host: process.env.REDIS_HOST ?? "localhost",
      port: Number(process.env.REDIS_PORT ?? 6379),
    });
  }
  return client;
}
