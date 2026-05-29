// server/utils/redis.ts
import Redis from "ioredis";

const MAX_RETRIES = 2; // retry the connection at most twice before giving up

let client: Redis | null = null;
let connectionLogged = false;

export function getRedis(): Redis | null {
  if (!process.env.REDIS_HOST) {
    if (!connectionLogged) {
      console.warn(
        "⚠️  Redis is not configured (REDIS_HOST not set) — rate limiting is disabled",
      );
      connectionLogged = true;
    }
    return null;
  }

  if (!client) {
    const target = `${process.env.REDIS_HOST}:${process.env.REDIS_PORT ?? 6379}`;

    client = new Redis({
      host: process.env.REDIS_HOST,
      port: Number(process.env.REDIS_PORT ?? 6379),
      lazyConnect: true,
      maxRetriesPerRequest: MAX_RETRIES,
      retryStrategy: (times) => {
        // Retry the connection a couple of times, then give up gracefully.
        if (times > MAX_RETRIES) return null; // null stops reconnecting
        console.warn(
          `⏳  Redis connection attempt ${times} failed (${target}) — retrying…`,
        );
        return Math.min(times * 200, 2000); // backoff before the next attempt
      },
    });

    client.on("connect", () => {
      connectionLogged = false; // allow re-logging if it drops again later
      console.log(
        `✅  Redis connected (${target}) — rate limiting is active`,
      );
    });

    // Log connection errors, but do NOT tear the client down here — doing so
    // would kill the retryStrategy before it gets a chance to retry.
    client.on("error", (err) => {
      if (!connectionLogged) {
        console.error(`❌  Redis error (${target}): ${err.message}`);
        connectionLogged = true;
      }
    });

    // Fired once ioredis has exhausted retries and stopped reconnecting.
    client.on("end", () => {
      console.error(
        `❌  Redis unreachable after ${MAX_RETRIES} retries (${target}) — rate limiting is disabled`,
      );
      client = null; // a later request will create a fresh client and retry
    });

    // Kick off the connection eagerly so retries happen at boot (not on the
    // first request). Errors are already surfaced by the handlers above, so
    // swallow the rejection here to avoid an unhandled promise rejection.
    client.connect().catch(() => {});
  }

  return client;
}
