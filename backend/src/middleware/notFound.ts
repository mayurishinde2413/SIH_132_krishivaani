import { Request, Response } from 'express';
import { fail } from '../utils/apiResponse';

export const notFound = (req: Request, res: Response) => {
  res.status(404).json(fail(`Route ${req.originalUrl} not found`, 404));
};
