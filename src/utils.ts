import { NextFunction, Request, Response } from 'express';

import { RequestHandler } from './types';

/**
 * Function that gets an async function as a prop, catches its errors
 * and runs next function in a call stack (mostly function that controls errors)
 * with passed caught errors into the next call
 *
 * @param fn - Async function to catch its errors
 * @returns an async function to catch the errors from its result
 */
export const catchAsync = (fn: RequestHandler) =>
  (request: Request, response: Response, next: NextFunction) =>
    fn(request, response, next).catch(next);