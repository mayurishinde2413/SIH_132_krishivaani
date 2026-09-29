import { Request, Response, NextFunction } from 'express';
import { fail } from '../utils/apiResponse';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  console.error('[Error]', err.message);
  res.status(500).json(fail(err.message || 'Internal server error', 500));
};
