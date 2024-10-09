import { Request, Response, NextFunction } from 'express';
import redisClient from '../config/redisClient';

export const CheckRedisConnection = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!redisClient.isOpen) {
    redisClient.connect();
  }

  next();
};
