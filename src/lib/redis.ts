import Redis from 'ioredis';

declare global {
  var redis: Redis | undefined;
}

let redis: Redis;

if (!global.redis) {
  // Ensure the REDIS_URL is defined
  const redisUrl = process.env.REDIS_URL;
  if (!redisUrl) {
    throw new Error('REDIS_URL environment variable is not defined');
  }

  // Initialize Redis with a guaranteed non-undefined URL
  global.redis = new Redis(redisUrl);
}

redis = global.redis;

export default redis;
