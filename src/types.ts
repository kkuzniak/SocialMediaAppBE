import { NextFunction, Request, Response } from 'express';

export type RequestHandler = (
  request: Request,
  response: Response,
  next: NextFunction) =>
Promise<void>;
