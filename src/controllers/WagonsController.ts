import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import redisClient from '../config/redisClient';
import { ErrorHandler } from '../middlewares/ErrorHandler';
import { CoastersModels } from '../models/coastersModels';
import { WagonsModels } from '../models/wagonsModels';
import { validateWagonData } from '../utils/validationDate';
import { readJsonFile, writeToJsonFile } from '../utils/jsonUtils';

export const registerWagon = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { coasterId } = req.params;
    const { seatCount, wagonSpeed } = req.body;

    const validationError = validateWagonData(seatCount, wagonSpeed);
    if (validationError) {
      throw new ErrorHandler(400, validationError);
    }

    const data = readJsonFile();
    const coaster: CoastersModels = data[coasterId];
    if (!coaster) {
      throw new ErrorHandler(404, 'Mountain coaster not found!');
    }

    const wagonId = uuidv4();

    const newWagon: WagonsModels = {
      wagonId,
      seatCount,
      wagonSpeed,
    };

    coaster.wagons.push(newWagon);
    data[coasterId] = coaster;
    writeToJsonFile(data);

    try {
      await redisClient.hSet('coasters', coasterId, JSON.stringify(coaster));
    } catch (redisError) {
      console.warn('Redis unavailable, only JSON updated.');
    }

    res
      .status(201)
      .json({ wagonId, message: 'New wagon has been added successfully' });
  } catch (error) {
    next(error);
  }
};

export const deleteWagon = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { coasterId, wagonId } = req.params;

    const data = readJsonFile();
    const coaster: CoastersModels = data[coasterId];
    if (!coaster) {
      throw new ErrorHandler(404, 'Mountain coaster not found!');
    }

    const wagonIndex = coaster.wagons.findIndex(
      (wagon) => wagon.wagonId === wagonId
    );
    if (wagonIndex === -1) {
      throw new ErrorHandler(404, 'Wagon not found!');
    }

    coaster.wagons.splice(wagonIndex, 1);
    data[coasterId] = coaster;
    writeToJsonFile(data);

    try {
      await redisClient.hSet('coasters', coasterId, JSON.stringify(coaster));
    } catch (redisError) {
      console.warn('Redis unavailable, only JSON updated.');
    }

    res.status(200).json({ message: 'Wagon has been removed successfully' });
  } catch (error) {
    next(error);
  }
};
