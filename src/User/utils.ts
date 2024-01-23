import JWT from 'jsonwebtoken';
import { Request, Response } from 'express';

import { IUser } from './types.ts';
import { STATUS_SUCCESS } from '../strings.ts';

/**
 * Function that generated JWT token for user id
 *
 * @param userId - User id
 * @returns - Generated JWT token
 */
const signToken = (userId: string) => JWT.sign({ id: userId }, process.env.JWT_SECRET, {
  expiresIn: process.env.JWT_EXPIRES_IN,
});

/**
 * Function that created JWT token and send it to the client
 *
 * @param user - User that wants the JWT
 * @param statusCode - Status code for the client response
 * @param req - Request
 * @param res - Response
 */
export const createSendToken = (user: IUser, statusCode: number, req: Request, res: Response) => {
  const token = signToken(user._id);
  const JWT_EXPIRES_IN_SECONDS = +process.env.JWT_COOKIE_EXPIRES_IN * 60 * 60 * 1000;

  res.cookie('jwt', token, {
    expires: new Date(Date.now() + JWT_EXPIRES_IN_SECONDS),
    httpOnly: true,
    secure: req.secure || req.headers['x-forwarded-proto'] === 'https',
  });

  res.status(statusCode).json({
    status: STATUS_SUCCESS,
    token,
    data: {
      user: {
        name: user.name,
        email: user.email,
      },
    },
  });
};