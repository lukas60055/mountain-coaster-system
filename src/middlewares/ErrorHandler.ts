import { Request, Response, NextFunction } from 'express';

export class ErrorHandler extends Error {
  statusCode: number;
  message: string;

  constructor(statusCode: number, message: string) {
    super();
    this.statusCode = statusCode;
    this.message = message;
  }
}

export const handleError = (
  err: ErrorHandler,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errStatus = err.statusCode || 500;
  const errMsg = err.message || 'Something went wrong';

  console.warn(`${errStatus}: ${errMsg}`);
  if (err.stack) {
    console.error(err.stack);
  }

  const errorResponse: { statusCode: number; message: string; stack?: string } =
    {
      statusCode: errStatus,
      message: errMsg,
    };

  if (process.env.NODE_ENV === 'development') {
    errorResponse.stack = err.stack;
  }

  res.status(errStatus).send(errorResponse);
};
