import { createClient } from 'redis';
import { syncJsonToRedis } from '../services/syncJsonToRedis';

const redisClient = createClient({
  url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
});

redisClient.on('connect', async () => {
  await syncJsonToRedis();
  console.log(
    'Connected to Redis successfully. Data synchronized from JSON to Redis'
  );
});

redisClient.on('error', (err) => {
  if (!redisClient.isOpen) {
    console.error('Redis error: ', err);
  }
  redisClient.disconnect();
});

export default redisClient;
