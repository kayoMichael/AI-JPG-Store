import Redis from 'ioredis';

import { env } from './env';

const redisClient = new Redis({
  host: env.REDIS_HOST,
  port: env.REDIS_PORT,
  username: env.REDIS_USERNAME,
  password: env.REDIS_PASSWORD,
  retryStrategy: function (times) {
    console.log(`Redis retry attempt ${times}`);
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
  maxRetriesPerRequest: 3,
});

redisClient.on('connect', () => {
  console.log('Redis client connected successfully');
});

redisClient.on('ready', () => {
  console.log('Redis client ready for operations');
});

redisClient.on('error', (err) => {
  console.error('Redis connection error:', err);
  setTimeout(() => {
    console.error('Shutting down due to Redis connection error');
    process.exit(1);
  }, 5000);
});

export default redisClient;
