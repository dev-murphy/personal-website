import { getRedis } from "../utils/redis";

const LIMIT = 60; // requests
const WINDOW = 60; // seconds

export default defineEventHandler(async (event) => {
  const path = event.path;

  // Skip rate limiting for internal Nuxt/prerender requests
  if (path.startsWith("/__nuxt") || path.startsWith("/_nuxt")) return;

  const ip =
    getRequestHeader(event, "x-forwarded-for")?.split(",")[0]!.trim() ??
    event.node.req.socket.remoteAddress ??
    "unknown";

  const key = `rl:${ip}`;
  const redis = getRedis();
  if (!redis) return;

  let count: number;
  try {
    count = await redis.incr(key);
    if (count === 1) {
      await redis.expire(key, WINDOW);
    }
  } catch (err) {
    // Redis is unreachable — fail open rather than blocking the request.
    console.error(
      `⚠️  Rate limiting skipped — Redis command failed: ${(err as Error).message}`,
    );
    return;
  }

  setResponseHeader(event, "X-RateLimit-Limit", String(LIMIT));
  setResponseHeader(
    event,
    "X-RateLimit-Remaining",
    String(Math.max(0, LIMIT - count)),
  );

  if (count > LIMIT) {
    setResponseStatus(event, 429);
    return { statusCode: 429, message: "Too many requests" };
  }
});
