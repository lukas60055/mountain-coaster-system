import fs from 'fs';
import path from 'path';
import redisClient from '../config/redisClient';

const environment = process.env.NODE_ENV || 'development';
const jsonFilePath = path.join(
  __dirname,
  `../../data/${environment}/coasters.json`
);

export const syncJsonToRedis = async () => {
  const jsonData = JSON.parse(fs.readFileSync(jsonFilePath, 'utf-8'));

  const redisKeys = await redisClient.hKeys('coasters');

  for (const redisKey of redisKeys) {
    if (!(redisKey in jsonData)) {
      await redisClient.hDel('coasters', redisKey);
      console.log(`Removed coaster ${redisKey} from Redis`);
    }
  }

  for (const [coasterId, coasterData] of Object.entries(jsonData)) {
    await redisClient.hSet('coasters', coasterId, JSON.stringify(coasterData));
  }
};
