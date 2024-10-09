import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import redisClient from '../config/redisClient';
import { ErrorHandler } from '../middlewares/ErrorHandler';
import { CoastersModels } from '../models/coastersModels';
import { validateCoasterData } from '../utils/validationDate';
import { readJsonFile, writeToJsonFile } from '../utils/jsonUtils';

export const registerCoaster = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { staffCount, clientCount, trackLength, openHours, closeHours } =
      req.body;

    const validationError = validateCoasterData(
      staffCount,
      clientCount,
      trackLength,
      openHours,
      closeHours
    );
    if (validationError) {
      throw new ErrorHandler(400, validationError);
    }

    const newCoaster: CoastersModels = {
      staffCount,
      clientCount,
      trackLength,
      openHours,
      closeHours,
      wagons: [],
    };

    const coasterId = uuidv4();

    const data = readJsonFile();
    data[coasterId] = newCoaster;
    writeToJsonFile(data);

    try {
      await redisClient.hSet('coasters', coasterId, JSON.stringify(newCoaster));
    } catch {
      console.warn('Redis unavailable, only JSON updated.');
    }

    res
      .status(201)
      .json({ coasterId, message: 'Mountain coaster registered!' });
  } catch (error) {
    next(error);
  }
};

export const updateCoaster = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { coasterId } = req.params;
    const { staffCount, clientCount, openHours, closeHours } = req.body;

    const validationError = validateCoasterData(
      staffCount,
      clientCount,
      0,
      openHours,
      closeHours
    );
    if (validationError) {
      throw new ErrorHandler(400, validationError);
    }

    const data = readJsonFile();
    const coaster = data[coasterId];
    if (!coaster) {
      throw new ErrorHandler(404, 'Mountain coaster not found!');
    }

    const updatedCoaster: CoastersModels = {
      ...coaster,
      staffCount,
      clientCount,
      openHours,
      closeHours,
    };

    data[coasterId] = updatedCoaster;
    writeToJsonFile(data);

    try {
      await redisClient.hSet(
        'coasters',
        coasterId,
        JSON.stringify(updatedCoaster)
      );
    } catch {
      console.warn('Redis unavailable, only JSON updated.');
    }

    res.status(200).json({ message: 'Mountain coaster updated!' });
  } catch (error) {
    next(error);
  }
};
