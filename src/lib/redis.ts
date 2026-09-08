import Redis from 'ioredis';

declare global {
  var redis: Redis | undefined;
}

// A best-effort wrapper around ioredis. Redis is only used as a cache in this
// app (every caller falls back to the database on a miss), so when Redis is
// unreachable — e.g. during local development — commands should degrade
// gracefully instead of throwing or hanging the request.
export type SafeRedis = {
  get: (key: string) => Promise<string | null>;
  set: (...args: Parameters<Redis['set']>) => Promise<unknown>;
  del: (...keys: string[]) => Promise<number>;
  exists: (...keys: string[]) => Promise<number>;
};

function createClient(): Redis | null {
  const redisUrl = process.env.REDIS_URL;
  if (!redisUrl) {
    console.warn('[redis] REDIS_URL is not defined — caching disabled');
    return null;
  }

  const client = new Redis(redisUrl, {
    // Fail fast instead of hanging a request while Redis is unreachable.
    maxRetriesPerRequest: 1,
    enableOfflineQueue: false,
    // Keep trying to reconnect (so it recovers if Redis comes back) but cap the
    // backoff so we don't hammer a dead endpoint.
    retryStrategy: (times) => Math.min(times * 500, 5000),
  });

  // Without an 'error' listener ioredis prints "Unhandled error event" for
  // every failed socket read. Log a single line per connection-state change.
  let warned = false;
  client.on('error', (err: Error) => {
    if (!warned) {
      warned = true;
      console.warn(`[redis] connection error — caching disabled: ${err.message}`);
    }
  });
  client.on('ready', () => {
    warned = false;
    console.log('[redis] connected');
  });

  return client;
}

if (!global.redis) {
  const client = createClient();
  if (client) {
    global.redis = client;
  }
}

const client = global.redis;

const safeRedis: SafeRedis = {
  async get(key) {
    if (!client) return null;
    try {
      return await client.get(key);
    } catch {
      return null;
    }
  },
  async set(...args) {
    if (!client) return null;
    try {
      return await (client.set as (...a: unknown[]) => Promise<unknown>)(...args);
    } catch {
      return null;
    }
  },
  async del(...keys) {
    if (!client) return 0;
    try {
      return await client.del(...keys);
    } catch {
      return 0;
    }
  },
  async exists(...keys) {
    if (!client) return 0;
    try {
      return await client.exists(...keys);
    } catch {
      return 0;
    }
  },
};

export default safeRedis;
