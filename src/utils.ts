import { NextFunction, Request, Response } from 'express';

import { RequestHandler } from './types.ts';

export const catchAsync = (fn: RequestHandler) =>
  (req: Request, res: Response, next: NextFunction) =>
    fn(req, res, next).catch(next);